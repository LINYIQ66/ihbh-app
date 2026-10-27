import React from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { command } from "@/api/commerce";
export default function RetailOrderReview() {
  const qc = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ["retail-review"],
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      base44.entities.SalesOrder.filter(
        { transaction_status: "posted" },
        {
          sort: "-created_date",
          limit: 30,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      ),
    getNextPageParam: (p) => (p.has_more ? p.next_cursor : undefined),
  });
  const mutation = useMutation({
    mutationFn: /** @param {{id:string,status:string}} data */ (data) =>
      command("commerce", {
        action: "review_order",
        ...data,
        refund_confirmed: data.status === "cancelled",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retail-review"] }),
  });
  const labels = {
    paid: "已支付·待发货",
    cancel_requested: "申请取消",
    cancelled: "已取消·积分已退还",
    shipped: "已发货",
  };
  const review = (order, status) => {
    if (
      window.confirm(
        status === "cancelled"
          ? `确认取消订单 ${order.id} 并退还 ${order.points - (order.reward || 0)} HBH（扣回购物奖励）？`
          : `确认订单 ${order.id} 已发货？`,
      )
    )
      mutation.mutate({ id: order.id, status });
  };
  return (
    <section className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="font-bold">商城订单与取消退款</h2>
      {query.isPending && <p>正在加载…</p>}
      {query.isError && <p role="alert">订单读取失败</p>}
      {(query.data?.pages.flatMap((p) => p.items) || []).map((o) => (
        <article className="rounded-lg border p-3 text-sm" key={o.id}>
          <b>
            {o.id} · S${Number(o.total).toFixed(2)}
          </b>
          <p>
            {o.user_id} · {labels[o.status]}
          </p>
          <p>{o.items.map((i) => `${i.name_zh} ×${i.quantity}`).join("、")}</p>
          {["paid", "cancel_requested"].includes(o.status) && (
            <div className="mt-2 flex gap-3">
              <button
                disabled={mutation.isPending}
                onClick={() => review(o, "cancelled")}
                className="text-destructive underline"
              >
                取消并退积分
              </button>
              {o.status === "paid" && (
                <button
                  disabled={mutation.isPending}
                  onClick={() => review(o, "shipped")}
                  className="underline"
                >
                  确认发货
                </button>
              )}
            </div>
          )}
        </article>
      ))}
      {mutation.isError && (
        <p role="alert" className="text-destructive">
          {mutation.error.response?.data?.error || mutation.error.message}
        </p>
      )}
      {query.hasNextPage && (
        <button
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          加载更多
        </button>
      )}
    </section>
  );
}
