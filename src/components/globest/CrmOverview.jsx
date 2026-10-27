import React from 'react';
import { Users, ShoppingBag, Coins, Target } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function CrmOverview() {
  const {state,t} = useExperience(); const won=state.customers.filter(c=>c.stage==='won').length;
  const metrics=[[Users,'客户总数','Total contacts',state.customers.length,'本机体验客户','On this device'],[Target,'成交转化率','Conversion',`${state.customers.length?Math.round(won/state.customers.length*100):0}%`,'按客户阶段计算','Based on contact stages'],[ShoppingBag,'我的订单','My orders',state.orders.length,'服务器确认记录','Server-confirmed records'],[Coins,'我的 HBH','My HBH',state.hbh,'不可兑换现金','No cash value']];
  return <div className="crm-metrics">{metrics.map(([Icon,z,e,value,sub,sube])=><div className="metric" key={e}><span><Icon size={16}/>{t(z,e)}</span><b>{value}</b><small>{t(sub,sube)}</small></div>)}</div>;
}