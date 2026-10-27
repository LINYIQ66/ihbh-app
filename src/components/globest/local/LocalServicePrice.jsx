import React from 'react';

const money = value => Number(value.toFixed(2)).toLocaleString('en-SG', { maximumFractionDigits: 2 });
const range = (min, max) => min === max ? money(min) : `${money(min)}–${money(max)}`;
export default function LocalServicePrice({ price, estimate, isDemo, deal }) {
  const hasPrice = Number.isFinite(price);
  const budget = hasPrice ? { min: price, max: price, unit: '', label: isDemo ? '示例参考价' : '服务参考价', rate: isDemo ? 1 : estimate?.rate ?? 0.9 } : estimate;
  if (budget?.quoteOnly) return <p className="text-xs text-muted-foreground">产品方案与费用见官网</p>;
  if (!budget) return <p className="text-xs text-muted-foreground">服务价格见官网</p>;
  const proposed = !isDemo && budget.rate < 1 && budget.min > 0;
  return <div className="space-y-2">
    <div className="space-y-1">
      <p className="text-[10px] leading-4 text-muted-foreground">{hasPrice ? budget.label : `服务参考价 · ${budget.label.replace(/预算/g, '')}`}</p>
      <p className={`${proposed ? 'text-xs text-muted-foreground' : 'text-base font-bold text-rewards'} break-words`}>S${range(budget.min, budget.max)}{budget.unit && <span className="ml-1 text-[10px] font-normal text-muted-foreground">/ {budget.unit}</span>}</p>
    </div>
    {proposed && <div className="space-y-1 rounded-md border border-rewards/20 bg-rewards/5 p-2">
      <p className="text-[10px] font-semibold text-rewards sm:text-xs">iHBH 9折参考价</p>
      <p className="break-words text-base font-bold leading-6 text-rewards sm:text-lg">S${range(budget.min * budget.rate, budget.max * budget.rate)}{budget.unit && <span className="ml-1 text-[10px] font-normal">/ {budget.unit}</span>}</p>
      <p className="text-[10px] leading-4 text-muted-foreground">价差 S${range(budget.min * (1 - budget.rate), budget.max * (1 - budget.rate))}</p>
    </div>}
    {deal && <p className="text-[10px] leading-4 text-primary">{isDemo ? '示例优惠' : '优惠参考'}：{deal}</p>}
  </div>;
}