import React from 'react';
export default function LiveRoomPanels() {
  return <div className="grid gap-3 sm:grid-cols-2"><details className="rounded-xl border p-3"><summary className="cursor-pointer font-semibold">聊天面板</summary><p className="mt-3 text-sm text-muted-foreground">实时聊天尚未接入；当前不能发送评论，不显示模拟观众消息。</p></details>
    <details className="rounded-xl border p-3"><summary className="cursor-pointer font-semibold">商品面板</summary><p className="mt-3 text-sm text-muted-foreground">当前直播房尚未绑定可核实商品，暂无商品；本面板不提供交易或积分抵扣。</p></details></div>;
}