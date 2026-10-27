import React from 'react';
import { ShieldOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export const banHost = async (room, reason) => {
  await base44.entities.LiveBan.create({ user_id: room.host_user_id, user_name: room.host_name, reason });
  await base44.entities.LiveRoom.updateMany({ host_user_id: room.host_user_id, status: 'live' }, { $set: { status: 'ended', viewer_count: 0, ended_at: new Date().toISOString() } });
};

export default function LiveBanAdmin({ bans, t, onChange }) {
  const unban = async id => { await base44.entities.LiveBan.delete(id); onChange(); };
  return <div className="mt-4 rounded-2xl border bg-card p-4">
    <h3 className="mb-2 flex items-center gap-2 font-bold"><ShieldOff size={18} className="text-red-600" />{t('已禁播用户（管理员）', 'Banned hosts (admin)')}</h3>
    {bans.length ? <ul className="space-y-2 text-sm">{bans.map(b => <li key={b.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted p-2">
      <span><b>{b.user_name || b.user_id}</b>{b.reason && <span className="ml-2 text-muted-foreground">{b.reason}</span>}</span>
      <button onClick={() => unban(b.id)} className="rounded-full border px-3 py-1 text-xs font-bold">{t('恢复直播权限', 'Restore')}</button>
    </li>)}</ul> : <p className="text-sm text-muted-foreground">{t('暂无禁播用户', 'No banned hosts')}</p>}
  </div>;
}