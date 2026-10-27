import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import useMe from '@/hooks/useMe';

export const MEMBER_RATE = { standard: 0, vip: 5, prestige: 10 }; // % off by tier

// Loads the member tier and the user's unused coupons (with their rules).
export default function useDiscounts() {
  const { data: user } = useMe();
  const q = useQuery({ queryKey: ['cart-discounts', user?.id], enabled: !!user, queryFn: async () => {
    const [member] = await base44.entities.MemberProfile.filter({ user_id: user.id, payment_status: 'paid', transaction_status: 'posted' }, '-joined_at', 1);
    const tickets = await base44.entities.Ticket.filter({ $or: [{ user_id: user.id }, { created_by_id: user.id }], kind: 'coupon', status: 'unused' });
    const coupons = tickets.length ? await base44.entities.Coupon.filter({ id: { $in: tickets.map(t => t.ref_id) } }) : [];
    return { tier: member?.payment_status === 'paid' ? member.tier : 'standard', coupons: tickets.map(t => ({ ticket: t, rule: coupons.find(c => c.id === t.ref_id) })).filter(x => x.rule?.active && (!x.rule.expires || x.rule.expires >= new Date(Date.now()+8*3600000).toISOString().slice(0,10))) };
  } });
  return q.data || { tier: 'standard', coupons: [] };
}

export const couponOff = (rule, sub) => !rule || sub < (rule.min_amount || 0) ? 0 : Math.min(sub, (rule.off_amount || 0) + Math.round(sub * (rule.percent || 0)) / 100);