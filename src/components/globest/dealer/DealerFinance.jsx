import React from 'react';
import DealerMoneyCards from '@/components/globest/dealer/DealerMoneyCards';
import DealerLedger from '@/components/globest/dealer/DealerLedger';
import DealerCalculationRules from '@/components/globest/dealer/DealerCalculationRules';
import useDealerSummary from '@/components/globest/dealer/useDealerSummary';

export default function DealerFinance({ user, children }) {
  const overview = useDealerSummary(user);
  if (overview.isPending) return <p role="status" className="p-5 text-center text-muted-foreground">正在读取实际账务…</p>;
  if (overview.isError) return <p role="alert" className="p-5 text-destructive">账务读取失败：{overview.error.response?.data?.error || overview.error.message}</p>;
  return <div className="space-y-5"><DealerMoneyCards summary={overview.summary} compact/><DealerLedger user={user} summary={overview.summary}/>{typeof children === 'function' ? children(overview.summary) : children}<DealerCalculationRules/></div>;
}