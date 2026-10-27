import { createClientFromRequest } from 'npm:@base44/sdk@0.8.57';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@6.0.0';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { address, message, signature } = await req.json();
    if (!address || !message || !signature) return Response.json({ error: 'Missing fields' }, { status: 400 });
    if (!message.includes(user.id)) return Response.json({ error: 'Message not bound to user' }, { status: 400 });
    const ts = Number(message.split('ts:')[1]);
    if (!ts || Math.abs(Date.now() - ts) > 10 * 60e3) return Response.json({ error: 'Message expired' }, { status: 400 });
    const ok = nacl.sign.detached.verify(new TextEncoder().encode(message), bs58.decode(signature), bs58.decode(address));
    if (!ok) return Response.json({ error: 'Invalid signature' }, { status: 400 });
    const W = base44.asServiceRole.entities.WalletLink;
    const taken = await W.filter({ address }, { limit: 5 });
    if (taken.items.some(w => w.user_id !== user.id)) return Response.json({ error: 'Wallet bound to another account' }, { status: 409 });
    if (taken.items.length) return Response.json({ ok: true, wallet: taken.items[0] });
    const wallet = await W.create({ user_id: user.id, address, provider: 'phantom', verified_at: new Date().toISOString() });
    return Response.json({ ok: true, wallet });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}