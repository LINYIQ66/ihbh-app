import { reconcileStock } from "../../shared/dealerInventoryMigration.ts";
import { saleOwner } from "../../shared/dealerMath.ts";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import Stripe from "npm:stripe@18.5.0";
import { secrets } from "base44:runtime";
import { applyMembership } from "../../shared/membership.ts";
import {
  all,
  ledger,
  money,
  ownerQuery,
  requestKey,
  requireThat,
  transact,
} from "../../shared/transactions.ts";

// Explicit administrative reconciliation. Never invoked during ordinary login.
// The immutable operation receipt retains the administrator, evidence note and
// supplied values; old records are not silently trusted or deleted.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      admin = await base44.auth.me();
    requireThat(admin?.role === "admin", "仅管理员可核对历史账目", 403);
    const input = await req.json(),
      client = base44.asServiceRole;
    const user = await client.entities.User.get(input.user_id);
    if (input.action === "preview")
      return Response.json({
        user_id: user.id,
        points: await all(client, "PointsLedger", { user_id: user.id }),
        purchases: await all(client, "PurchaseOrder", ownerQuery(user.id)),
        withdrawals: await all(client, "Withdrawal", ownerQuery(user.id)),
        tickets: await all(client, "Ticket", ownerQuery(user.id)),
        shipments: await all(client, "ShipOrder", saleOwner(user.id)),
        profiles: await all(client, "MemberProfile", { email: user.email }),
      });
    requireThat(
      input.confirmed === true &&
        typeof input.reason === "string" &&
        input.reason.trim().length >= 10,
      "请核对原始凭据并填写至少10字的核对说明",
    );
    if (input.action === "inventory")
      return Response.json(await reconcileStock(client, admin, user.id, input));
    if (input.action === "membership") {
      const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
      const session = await stripe.checkout.sessions.retrieve(input.session_id);
      requireThat(
        session.customer_details?.email?.toLowerCase() ===
          user.email?.toLowerCase(),
        "付款邮箱与会员不符",
      );
      requireThat(
        !session.client_reference_id || session.client_reference_id === user.id,
        "付款已绑定其他会员",
      );
      const metadata = session.metadata || {},
        prefix = metadata.package_tier ? "package" : "membership";
      requireThat(
        !metadata[`${prefix}_user_id`] ||
          metadata[`${prefix}_user_id`] === user.id,
        "付款已绑定其他会员",
      );
      const lines = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
      requireThat(!lines.has_more, "付款项目不符");
      return Response.json(
        await applyMembership(
          client,
          user,
          {
            ...session,
            client_reference_id: user.id,
            metadata: { ...metadata, [`${prefix}_user_id`]: user.id },
          },
          lines.data,
          secrets.get("BASE44_APP_ID"),
        ),
      );
    }
    if (input.action === "points") {
      requireThat(
        Number.isSafeInteger(input.balance) &&
          input.balance >= 0 &&
          Number.isSafeInteger(input.lifetime) &&
          input.lifetime >= 0,
        "核对后的积分必须是非负整数",
      );
      return Response.json(
        await transact(
          client,
          "User",
          user.id,
          requestKey(input.ref),
          { ...input, reviewer: admin.id },
          (state) => {
            const correction = input.balance - state.balance;
            const drafts = correction
              ? [
                  ledger(
                    state,
                    user.id,
                    correction,
                    "adjust",
                    input.ref,
                    `历史积分核对：${input.reason}`,
                  ),
                ]
              : [];
            state.balance = input.balance;
            state.lifetime = input.lifetime;
            state.reconciled_by = admin.id;
            return { drafts, result: { balance: state.balance } };
          },
          { allowLegacyReview: true },
        ),
      );
    }
    requireThat(
      input.action === "document" &&
        ["PurchaseOrder", "Withdrawal", "Ticket"].includes(input.entity),
      "不支持的迁移操作",
    );
    return Response.json(
      await transact(
        client,
        "User",
        user.id,
        requestKey(input.ref),
        { ...input, reviewer: admin.id },
        async () => {
          const row = await client.entities[input.entity].get(input.id);
          requireThat(
            row.created_by_id === user.id &&
              !row.transaction_id &&
              !row.legacy_reviewed,
            "仅可核对该用户创建且尚未核对的历史单据",
            409,
          );
          requireThat(
            ["accept", "reject"].includes(input.decision),
            "请选择接受或作废",
          );
          const values: Record<string, unknown> = {
            user_id: user.id,
            transaction_status: "posted",
            legacy_reviewed: true,
            review_note: input.reason,
            reviewed_by: admin.id,
          };
          if (input.decision === "reject")
            values.status =
              input.entity === "Ticket" ? "cancelled" : "rejected";
          else if (input.entity === "Withdrawal")
            requireThat(
              money(row.amount) >= 5000 && row.bank,
              "提现金额或银行卡异常，不可导入",
            );
          else if (input.entity === "PurchaseOrder") {
            requireThat(
              Array.isArray(row.items) && row.items.length > 0,
              "缺少采购明细",
            );
            const total = row.items.reduce((sum, i) => {
              requireThat(
                Number.isInteger(i.qty) &&
                  i.qty > 0 &&
                  i.product_id &&
                  money(i.price) > 0,
                "明细无效",
              );
              return sum + money(i.price) * i.qty;
            }, 0);
            requireThat(
              total === money(row.amount) &&
                money(row.balance_used || 0) <= total &&
                money(row.balance_credit || 0) ===
                  (row.is_first ? Math.max(0, total - 150000) : 0) &&
                (!row.is_first || total >= 150000),
              "采购金额或余额记录异常，不可导入",
            );
            values.items = await Promise.all(
              row.items.map(async (item) => {
                const product = await client.entities.Product.get(
                  item.product_id,
                );
                requireThat(
                  ["general", "genecells"].includes(
                    product.dealer_sale_category,
                  ),
                  "请先配置商品分润类别再接纳历史采购",
                );
                return { ...item, sale_category: product.dealer_sale_category };
              }),
            );
          } else {
            requireThat(row.kind !== "coupon" || row.ref_id, "优惠券缺少来源");
            money(row.amount || 0);
            Object.assign(values, {
              issued_by: "commerce-v1",
              payment_status: row.amount ? "due" : "free",
              points_cost: 0,
            });
          }
          return {
            effects: [
              {
                entity: input.entity,
                id: row.id,
                expected: { status: row.status },
                values,
              },
            ],
          };
        },
      ),
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
