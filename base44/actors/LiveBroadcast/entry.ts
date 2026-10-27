import { Actor } from 'base44:runtime/actors';

const MAX_CONNECTIONS = 10;
export default class LiveBroadcast extends Actor {
  queue=Promise.resolve();
  tickIntervalMs=2000;
  shouldTick(){return Boolean(this.hostSeat);}
  async permitted(){
    if(!this.hostSeat)return true;
    const host=[...this.users.values()].find(u=>u.seat===this.hostSeat);
    const [banned,room]=await Promise.all([this.client.asServiceRole.entities.LiveBan.count({user_id:host?.userId}),this.client.asServiceRole.entities.LiveRoom.get(this.registryId)]);
    return !banned&&room.status==='live'&&room.host_user_id===host?.userId;
  }
  handleTick(){this.queue=this.queue.catch(()=>{}).then(async()=>{if(!await this.permitted())await this.endSession();});return this.queue;}
  handleMessage(conn,msg){this.queue=this.queue.catch(()=>{}).then(()=>this.processMessage(conn,msg));return this.queue;}
  users = new Map();
  nextSeat = 1;
  hostSeat = null;
  registryId = null;
  lastFrameAt = 0;

  async handleStart() {
    const savedUsers = await this.storage.get('users');
    const savedSession = await this.storage.get('session');
    if (savedUsers) this.users = new Map(savedUsers);
    if (savedSession) { this.hostSeat = savedSession.hostSeat; this.registryId = savedSession.registryId; }
    const liveIds = new Set(this.getConnections().map(conn => conn.id));
    for (const id of this.users.keys()) if (!liveIds.has(id)) this.users.delete(id);
    this.nextSeat = Math.max(0, ...[...this.users.values()].map(user => user.seat)) + 1;
    if (this.hostSeat && ![...this.users.values()].some(user => user.seat === this.hostSeat)) await this.endSession();
  }

  async handleConnect(conn) {
    const existing=this.users.get(conn.id);
    const uid=conn.identity?.type==='authenticated'?conn.identity.userId:null;
    if(existing&&existing.userId!==uid){conn.reject(4003,'identity mismatch');return;}
    if (!this.users.has(conn.id) && this.users.size >= MAX_CONNECTIONS) { conn.reject(4001, 'room full'); return; }
    if (!this.users.has(conn.id)) this.users.set(conn.id, { seat: this.nextSeat++, role: 'viewer', joined: false, userId: conn.identity?.type === 'authenticated' ? conn.identity.userId : null });
    await this.save();
    conn.send({ type: 'you', seat: this.users.get(conn.id).seat });
    conn.send({ type: 'status', live: Boolean(this.hostSeat), viewers: this.viewerCount() });
  }

  async processMessage(conn, msg) {
    if(this.hostSeat&&!await this.permitted()){await this.endSession();return;}
    if (!msg || typeof msg !== 'object') return;
    const user = this.users.get(conn.id); if (!user) return;
    if (msg.type === 'host_start') {
      if (this.hostSeat === user.seat && user.role === 'host') return conn.send({ type: 'host_ready' });
      if (!user.userId || this.hostSeat) return conn.send({ type: 'error', message: 'Only a signed-in user can start this live.' });
      const registryId = String(msg.registryId || '').slice(0, 64);
      const record = registryId ? await this.client.asServiceRole.entities.LiveRoom.get(registryId) : null;
      if (!record || registryId !== this.instanceId || record.host_user_id !== user.userId || await this.client.asServiceRole.entities.LiveBan.count({user_id:user.userId})) return conn.send({ type: 'error', message: 'Invalid live room.' });
      user.role = 'host'; this.hostSeat = user.seat; this.registryId = registryId; await this.save();
      await this.updateRoom({ status: 'live', viewer_count: 0 });
      conn.send({ type: 'host_ready' });
      this.broadcast({ type: 'status', live: true, viewers: 0 });
    } else if (msg.type === 'frame' && user.role === 'host' && this.hostSeat === user.seat) {
      if (typeof msg.frame !== 'string' || msg.frame.length > 96000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(msg.frame) || Date.now() - this.lastFrameAt < 400) return;
      this.lastFrameAt = Date.now();
      for (const viewer of this.users.values()) if (viewer.joined && viewer.role !== 'host') this.sendToSeat(viewer.seat, { type: 'frame', frame: msg.frame });
    } else if (msg.type === 'join' && this.hostSeat && user.role !== 'host') {
      if (!user.joined) { user.joined = true; await this.save(); await this.updateRoom({ viewer_count: this.viewerCount() }); }
      this.sendToSeat(this.hostSeat, { type: 'viewer_joined', viewerSeat: user.seat });
      this.broadcast({ type: 'viewer_count', viewers: this.viewerCount() });
    } else if (msg.type === 'offer' && user.role === 'host') this.relay(user, msg, 'offer');
    else if (msg.type === 'answer' && user.joined) this.relay(user, msg, 'answer');
    else if (msg.type === 'ice' && (user.role === 'host' || user.joined)) this.relay(user, msg, 'ice');
    else if (msg.type === 'host_stop' && user.role === 'host') await this.endSession();
  }

  handleClose(conn){this.queue=this.queue.catch(()=>{}).then(()=>this.processClose(conn));return this.queue;}
  async processClose(conn) {
    const user = this.users.get(conn.id); if (!user) return;
    this.users.delete(conn.id);
    if (user.role === 'host') await this.endSession();
    else if (user.joined) { this.sendToSeat(this.hostSeat, { type: 'viewer_left', viewerSeat: user.seat }); await this.updateRoom({ viewer_count: this.viewerCount() }); this.broadcast({ type: 'viewer_count', viewers: this.viewerCount() }); }
    await this.save();
  }

  relay(user, msg, type) {
    const target=[...this.users.values()].find(u=>u.seat===Number(msg.targetSeat));
    if(!target || (user.role==='host' ? !target.joined || target.role==='host' : target.seat!==this.hostSeat) || JSON.stringify(msg).length>32000)return;
    const targetSeat = Number(msg.targetSeat); if (!targetSeat) return; this.sendToSeat(targetSeat, { type, fromSeat: user.seat, sdp: msg.sdp, candidate: msg.candidate }); }
  sendToSeat(seat, payload) { const entry = [...this.users.entries()].find(([, user]) => user.seat === seat); const conn = entry && this.getConnections().find(item => item.id === entry[0]); if (conn) conn.send(payload); }
  viewerCount() { return [...this.users.values()].filter(user => user.joined && user.role !== 'host').length; }
  async endSession() { if (this.registryId) await this.updateRoom({ status: 'ended', viewer_count: 0, ended_at: new Date().toISOString() }); this.hostSeat = null; for(const user of this.users.values()){user.role='viewer';user.joined=false;} this.broadcast({ type: 'host_ended' }); await this.save(); }
  async updateRoom(data) { try { if (this.registryId) await this.client.asServiceRole.entities.LiveRoom.update(this.registryId, data); } catch (error) { console.error('Live room update failed', error); } }
  save() { return Promise.all([this.storage.put('users', [...this.users.entries()]), this.storage.put('session', { hostSeat: this.hostSeat, registryId: this.registryId })]); }
}