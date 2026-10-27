import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';

const tierNames = { standard: ['普通会员','Standard'], vip: ['VIP会员','VIP'], prestige: ['尊享会员','Prestige'] };

export default function MemberTierTable() {
  const { t } = useExperience();
  const { data = [], isLoading } = useQuery({ queryKey: ['member-profiles'], queryFn: () => base44.entities.MemberProfile.list('-joined_at', 100) });
  if (isLoading) return <div className="crm-table-card p-8 text-center text-muted-foreground">{t('正在读取会员分层…','Loading member tiers…')}</div>;
  return <div className="crm-table-card"><div className="overflow-x-auto">{data.length ? <table className="crm-table"><thead><tr><th>{t('会员','Member')}</th><th>{t('自动分层','Automatic tier')}</th><th>{t('入会费用','Joining fee')}</th><th>{t('积分余额','Points balance')}</th><th>{t('入会日期','Joined')}</th></tr></thead><tbody>{data.map(member => <tr key={member.id}><td><b>{member.name || '—'}</b><small>{member.email}</small></td><td><span className="new-badge">{t(...(tierNames[member.tier] || tierNames.standard))}</span></td><td>S${Number(member.membership_fee).toLocaleString()}</td><td>{Number(member.points_balance || 0).toLocaleString()}</td><td>{member.joined_at ? new Date(member.joined_at).toLocaleDateString() : '—'}</td></tr>)}</tbody></table> : <div className="empty-state"><Users size={34}/><h3>{t('尚无已付款会员','No paid members yet')}</h3><p>{t('会员完成 Stripe 入会付款后会自动出现在这里。','Members appear here automatically after Stripe payment.')}</p></div>}</div></div>;
}