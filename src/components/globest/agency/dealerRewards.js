// Preview uses the same per-recipient integer-cent rounding as the server.
export function peerRewardPreview(value) {
  const amount=Number(value), cents=Math.round(amount*100);
  if(!Number.isFinite(amount)||amount<0||amount>1000000||Math.abs(amount*100-cents)>0.00001)return null;
  const rewards=[5,3,2].map(rate=>Number((BigInt(cents)*BigInt(rate)+50n)/100n));
  return {rewards:rewards.map(n=>n/100),total:rewards.reduce((n,r)=>n+r,0)/100};
}
