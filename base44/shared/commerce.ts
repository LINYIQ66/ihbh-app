import {
  all,
  day,
  ledger,
  money,
  ownerQuery,
  requestKey,
  requireThat,
  snapshot,
  transact,
} from "./transactions.ts";
import { getAccount } from "./dealerMath.ts";
import { earnedBalance } from "./earnedBalance.ts";
import { journal } from "../../src/components/globest/journalData.js";
import { journalMore } from "../../src/components/globest/journalMore.js";
const articleIds = new Set([...journal, ...journalMore].map((a) => a.id));
export const gifts = {
  tea: ["养生凉茶一杯", 50],
  chenpi: ["陈皮礼盒（小）", 300],
  assessment: ["AI 体质测评一次", 100],
  therapy: ["理疗体验 30 分钟", 800],
};
const visible = { transaction_status: { $ne: "prepared" } };
const owned = (r, id) =>
  r.user_id === id || (!r.user_id && r.created_by_id === id);
const effect = (entity, row, values) => ({
  entity,
  id: row.id,
  expected: {
    status: row.status,
    transaction_id: row.transaction_id || { $exists: false },
  },
  values,
});
const ticket = (user, kind, ref, title, values = {}) => ({
  entity: "Ticket",
  resultKey: "ticket_id",
  data: {
    user_id: user.id,
    kind,
    ref_id: ref,
    title,
    code: crypto.randomUUID().replaceAll("-", "").toUpperCase(),
    status: "unused",
    amount: 0,
    issued_by: "commerce-v1",
    payment_status: "free",
    ...values,
  },
});
export async function catalog(client, rows, dealerTier = undefined) {
  requireThat(
    Array.isArray(rows) && rows.length > 0 && rows.length <= 50,
    "请选择商品（最多50种）",
  );
  requireThat(
    new Set(rows.map((r) => r.id || r.product_id)).size === rows.length,
    "商品重复",
  );
  const result = [];
  for (const row of rows) {
    const qty = row.quantity ?? row.qty;
    requireThat(
      Number.isInteger(qty) && qty > 0 && qty <= 1000,
      "数量必须为1至1000的整数",
    );
    const p = await client.entities.Product.get(row.id || row.product_id);
    requireThat(
      p.approval_status === "published" && p.is_demo === false,
      "商品尚未开放真实交易",
      409,
    );
    if (dealerTier) {
      requireThat(['partner','official','agent'].includes(dealerTier) && p.dealer_enabled === true && ['general','genecells'].includes(p.dealer_sale_category), '商品未配置经销价格或分润类别', 409);
      const prices=['partner','official','agent'].map(tier=>money(p[`dealer_price_${tier}`]));
      requireThat(prices[0]>0&&prices[0]<=prices[1]&&prices[1]<=prices[2], '经销拿货价需满足合伙人≤官方≤总代，请管理员核对', 409);
    }
    const price = money(dealerTier ? p[`dealer_price_${dealerTier}`] : p.price);
    requireThat(price > 0, "商品价格无效");
    result.push({
      id: p.id,
      product_id: p.id,
      name: p.name_zh,
      name_zh: p.name_zh,
      name_en: p.name_en,
      image: p.image,
      price: price / 100,
      ...(dealerTier ? { sale_category: p.dealer_sale_category } : {}),
      qty,
      quantity: qty,
    });
  }
  return result;
}
export async function points(client, user, input) {
  const action = input.action || "summary",
    today = day();
  if (action === "summary") {
    const { state } = await snapshot(client, "User", user.id);
    for (const t of Object.values(state.outgoing || {}))
      await creditTransfer(client, user, t);
    const orders = await client.entities.SalesOrder.filter(
      { user_id: user.id, transaction_status: "posted" },
      { sort: "-created_date", limit: 100 },
    );
    return {
      balance: state.balance,
      lifetime: state.lifetime,
      tier:
        state.lifetime >= 5000
          ? "prestige"
          : state.lifetime >= 1000
            ? "vip"
            : "standard",
      checkedIn: state.checkin === today,
      sgd_value: state.balance / 10,
      board: state.board || [1, 1, 0, 0, 0, 0, 0, 0, 0],
      merges: state.merges || 0,
      orders: orders.items,
      orders_has_more: orders.has_more,
    };
  }
  requireThat(action !== "spend", "请通过订单或兑换入口支付");
  const key =
    action === "checkin"
      ? `checkin:${today}`
      : action === "earn"
        ? `read:${input.key}:${today}`
        : requestKey(input.ref);
  const result = await transact(
    client,
    "User",
    user.id,
    key,
    input,
    async (state) => {
      const drafts = [],
        result: any = {};
      if (action === "checkin") {
        requireThat(state.checkin !== today, "今日已签到", 409);
        state.checkin = today;
        drafts.push(ledger(state, user.id, 20, "checkin", key, "每日签到"));
        result.amount = 20;
      } else if (action === "read_start") {
        requireThat(articleIds.has(input.article_id), "文章不存在");
        state.reading = { id: input.article_id, started: Date.now() };
      } else if (action === "earn") {
        const id = String(input.key || "").replace(/^read-/, "");
        requireThat(
          articleIds.has(id) &&
            state.reading?.id === id &&
            Date.now() - state.reading.started >= 15000,
          "请先阅读这篇文章15秒",
        );
        const reads = state.read_day === today ? state.read_ids || [] : [];
        requireThat(
          !reads.includes(id) && reads.length < 5,
          "今日阅读奖励已领取或达到上限",
          409,
        );
        state.read_day = today;
        state.read_ids = [...reads, id];
        state.reading = null;
        drafts.push(
          ledger(state, user.id, 10, "interaction", key, `阅读 ${id}`),
        );
        result.amount = 10;
      } else if (action === "game") {
        const board = [...(state.board || [1, 1, 0, 0, 0, 0, 0, 0, 0])];
        let reward = 0;
        requireThat(Date.now() - (state.game_at || 0) >= 400, "操作太快", 429);
        const { from, to, move } = input;
        if (move === "plant") {
          const i = board.indexOf(0);
          requireThat(i >= 0, "没有空地");
          board[i] = 1;
        } else if (move === "reset") {
          requireThat(
            !board.includes(0) &&
              !board.some((v, i) => v < 6 && board.indexOf(v) !== i),
            "花园仍可继续",
          );
          board.splice(0, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0);
        } else {
          requireThat(
            move === "move" &&
              Number.isInteger(from) &&
              Number.isInteger(to) &&
              from >= 0 &&
              from < 9 &&
              to >= 0 &&
              to < 9 &&
              from !== to &&
              board[from] > 0,
            "无效的移动",
          );
          requireThat(
            board[to] === 0 || (board[to] === board[from] && board[to] < 6),
            "无法合成",
          );
          if (board[to]) {
            reward = board[to] * 2;
            board[to]++;
            state.merges = (state.merges || 0) + 1;
          } else board[to] = board[from];
          board[from] = 0;
        }
        state.board = board;
        state.game_at = Date.now();
        const earned = state.game_day === today ? state.game_earned || 0 : 0;
        reward = Math.max(0, Math.min(reward, 200 - earned));
        state.game_day = today;
        state.game_earned = earned + reward;
        if (reward)
          drafts.push(
            ledger(state, user.id, reward, "game", key, "服务器校验合成奖励"),
          );
        Object.assign(result, {
          amount: reward,
          board,
          merges: state.merges || 0,
        });
      } else if (action === "redeem") {
        const gift = gifts[input.gift_id];
        requireThat(gift, "礼品不存在");
        drafts.push(
          ledger(state, user.id, -gift[1], "redeem", key, `兑换 ${gift[0]}`),
          ticket(user, "service", input.gift_id, gift[0], {
            payment_status: "points",
            points_cost: gift[1],
            note: `${gift[1]} HBH 兑换`,
          }),
        );
      } else if (action === "checkout") {
        const rows = await catalog(client, input.items),
          subtotal = rows.reduce((sum, r) => sum + money(r.price) * r.qty, 0);
        requireThat(subtotal <= 100000000, "订单金额过大");
        const tier =
          state.membership?.payment_status === "paid"
            ? state.membership.tier
            : "standard";
        let total =
          subtotal -
          Math.round(
            (subtotal * ({ standard: 0, vip: 5, prestige: 10 }[tier] || 0)) /
              100,
          );
        const effects = [];
        if (input.coupon_id) {
          const t = await client.entities.Ticket.get(input.coupon_id);
          requireThat(
            owned(t, user.id) &&
              t.issued_by === "commerce-v1" &&
              t.kind === "coupon" &&
              t.status === "unused" &&
              t.transaction_status === "posted",
            "优惠券不可用",
            409,
          );
          const c = await client.entities.Coupon.get(t.ref_id);
          requireThat(
            c.active && (!c.expires || c.expires >= today),
            "优惠券已过期",
            409,
          );
          requireThat(total >= money(c.min_amount || 0), "未达到用券金额");
          requireThat(
            Number.isFinite(c.percent || 0) &&
              (c.percent || 0) >= 0 &&
              (c.percent || 0) <= 100,
            "优惠券折扣配置无效",
          );
          total -= Math.min(
            total,
            money(c.off_amount || 0) +
              Math.round((total * (c.percent || 0)) / 100),
          );
          effects.push(
            effect("Ticket", t, {
              status: "used",
              used_at: new Date().toISOString(),
              checkout_ref: key,
            }),
          );
        }
        if (input.expected_total !== undefined)
          requireThat(
            money(input.expected_total) === total,
            "商品价格或优惠已变化，请刷新后重新确认",
            409,
          );
        const cost = Math.ceil(total / 10),
          reward = Math.floor(total / 200);
        drafts.push(
          ledger(state, user.id, -cost, "redeem", key, "商城订单支付"),
        );
        if (reward)
          drafts.push(
            ledger(
              state,
              user.id,
              reward,
              "purchase",
              `${key}:reward`,
              "购物奖励",
            ),
          );
        drafts.push({
          entity: "SalesOrder",
          resultKey: "order_id",
          data: {
            user_id: user.id,
            items: rows,
            total: total / 100,
            points: cost,
            reward,
            coupon_id: input.coupon_id || "",
            payment_ref: key,
            date: new Date().toISOString(),
            paid: true,
            status: "paid",
          },
        });
        return {
          drafts,
          effects,
          result: { points: cost, back: reward, total: total / 100 },
        };
      } else if (action === "transfer") {
        const amount = input.amount;
        requireThat(
          Number.isSafeInteger(amount) && amount > 0 && amount <= 1000000,
          "积分金额无效",
        );
        const email = String(input.email || "")
            .trim()
            .toLowerCase(),
          users = (await client.entities.User.filter({ email }, { limit: 2 }))
            .items;
        requireThat(
          users.length === 1 && users[0].id !== user.id,
          "收款人无效",
        );
        state.outgoing ||= {};
        requireThat(
          Object.keys(state.outgoing).length < 20,
          "有转账待处理，请刷新余额",
          409,
        );
        const transfer = { key, amount, to: users[0].id, email };
        drafts.push(
          ledger(
            state,
            user.id,
            -amount,
            "transfer_out",
            key,
            `转账至 ${email}`,
            transfer.to,
          ),
        );
        state.outgoing[key] = transfer;
        result.transfer = transfer;
      } else requireThat(false, "操作无效");
      return { drafts, result };
    },
  );
  if (result.transfer) await creditTransfer(client, user, result.transfer);
  return result;
}
async function creditTransfer(client, user, t) {
  const key = `credit:${user.id}:${t.key}`;
  await transact(
    client,
    "User",
    t.to,
    key,
    { from: user.id, amount: t.amount },
    (state) => ({
      drafts: [
        ledger(
          state,
          t.to,
          t.amount,
          "transfer_in",
          key,
          `来自 ${user.email} 的转账`,
          user.id,
        ),
      ],
    }),
  );
  await transact(
    client,
    "User",
    user.id,
    `settled:${t.key}`,
    { key: t.key },
    (state) => {
      delete state.outgoing?.[t.key];
      return {};
    },
  );
}
export async function tickets(client, user, input) {
  const { action } = input;
  let row;
  if (["cancel_ticket", "verify_ticket"].includes(action)) {
    if (action === "verify_ticket") {
      requireThat(user.role === "admin", "无权核销", 403);
      const rows = (
        await client.entities.Ticket.filter(
          {
            code: String(input.code || "")
              .trim()
              .toUpperCase(),
            transaction_status: "posted",
          },
          { limit: 2 },
        )
      ).items;
      requireThat(rows.length === 1, "券码不存在或重复", 404);
      row = rows[0];
    } else row = await client.entities.Ticket.get(input.ticket_id);
    requireThat(
      row.issued_by === "commerce-v1" && row.transaction_status === "posted",
      "历史票券需先由管理员核对来源",
      409,
    );
    requireThat(
      action === "verify_ticket" || owned(row, user.id),
      "无权操作此票券",
      403,
    );
  }
  const kind = row?.kind || input.kind,
    ref = row?.ref_id || input.ref_id,
    resource =
      kind === "event" ? "SalonEvent" : kind === "venue" ? "Venue" : "User",
    uid = row?.user_id || user.id,
    id = resource === "User" ? uid : ref;
  const key = row
    ? `${action}:${row.id}`
    : kind === "coupon"
      ? `coupon:${ref}`
      : requestKey(input.ref);
  return transact(
    client,
    resource,
    id,
    key,
    { ...input, user_id: user.id },
    async (state, record) => {
      if (row) {
        const t = await client.entities.Ticket.get(row.id);
        requireThat(t.status === "unused", "票券已使用或取消", 409);
        if (action === "verify_ticket") {
          requireThat(
            t.kind !== "coupon" || !t.date || t.date >= day(),
            "优惠券已过期",
          );
          requireThat(
            t.payment_status !== "due" || input.receipt_confirmed === true,
            "请核实线下收款后确认",
            409,
          );
          return {
            effects: [
              effect("Ticket", t, {
                status: "used",
                used_at: new Date().toISOString(),
                verified_by: user.id,
                payment_status:
                  t.payment_status === "due" ? "paid" : t.payment_status,
              }),
            ],
            result: { title: t.title },
          };
        }
        const drafts = [];
        if (t.payment_status === "points")
          drafts.push(
            ledger(state, uid, t.points_cost, "adjust", key, "取消兑换退款"),
          );
        return {
          drafts,
          effects: [effect("Ticket", t, { status: "cancelled" })],
        };
      }
      requireThat(action === "issue_ticket", "操作无效");
      if (kind === "coupon") {
        const c = await client.entities.Coupon.get(ref);
        requireThat(
          c.active && (!c.expires || c.expires >= day()),
          "优惠券不可领取",
        );
        return {
          drafts: [
            ticket(user, kind, ref, `${c.title}（${c.rule}）`, {
              date: c.expires || "",
              note: c.partner || "",
            }),
          ],
        };
      }
      const rows = await all(client, "Ticket", {
        ref_id: ref,
        kind,
        status: { $ne: "cancelled" },
        ...visible,
      });
      if (kind === "event") {
        requireThat(
          record.status === "open" && Date.parse(record.start_at) > Date.now(),
          "活动已截止",
        );
        requireThat(
          Number.isInteger(record.capacity) && record.capacity > rows.length,
          "活动名额已满",
          409,
        );
        requireThat(!rows.some((t) => owned(t, user.id)), "已报名", 409);
        const amount = money(record.fee || 0) / 100;
        return {
          drafts: [
            ticket(user, kind, ref, record.title, {
              date: record.start_at,
              amount,
              payment_status: amount ? "due" : "free",
            }),
          ],
        };
      }
      requireThat(kind === "venue" && record.available, "场地不可预定");
      const start = Date.parse(input.date),
        hours = input.hours,
        end = start + hours * 3600000;
      requireThat(
        Number.isInteger(hours) &&
          hours >= 1 &&
          hours <= 8 &&
          Number.isFinite(start) &&
          start > Date.now() &&
          start < Date.now() + 180 * 86400000,
        "预定时间无效",
      );
      requireThat(
        !rows.some(
          (t) =>
            Date.parse(t.date) < end && Date.parse(t.ends_at || t.date) > start,
        ),
        "该时段已预定",
        409,
      );
      requireThat(
        !rows.some(
          (t) => !t.ends_at && t.date?.slice(0, 10) === input.date.slice(0, 10),
        ),
        "该日期存在待核对的历史预定",
        409,
      );
      const amount = (money(record.price_per_hour) * hours) / 100;
      return {
        drafts: [
          ticket(user, kind, ref, record.name, {
            date: new Date(start).toISOString(),
            ends_at: new Date(end).toISOString(),
            amount,
            note: `${hours} 小时`,
            payment_status: amount ? "due" : "free",
          }),
        ],
      };
    },
  );
}
export async function dealerFinance(client, user, input) {
  const action = input.action;
  let target;
  if (
    ["review_withdrawal", "review_purchase", "receive_purchase"].includes(
      action,
    )
  ) {
    requireThat(
      action === "receive_purchase" || user.role === "admin",
      "仅管理员可审核",
      403,
    );
    target = await client.entities[
      action === "review_withdrawal" ? "Withdrawal" : "PurchaseOrder"
    ].get(input.id);
    requireThat(
      target.user_id && target.transaction_status === "posted",
      "历史单据需先核对金额与来源",
      409,
    );
    requireThat(
      action !== "receive_purchase" || target.user_id === user.id,
      "无权确认收货",
      403,
    );
  }
  const uid = target?.user_id || user.id;
  return transact(
    client,
    "User",
    uid,
    requestKey(input.ref),
    input,
    async () => {
      if (target) {
        const entity =
            action === "review_withdrawal" ? "Withdrawal" : "PurchaseOrder",
          row = await client.entities[entity].get(target.id),
          next = action === "receive_purchase" ? "received" : input.status;
        const transitions =
          entity === "Withdrawal"
            ? { pending: ["approved", "rejected"] }
            : {
                pending: ["approved", "rejected"],
                approved: ["paid", "rejected"],
                paid: ["received"],
              };
        requireThat(
          transitions[row.status]?.includes(next),
          "单据状态已变化",
          409,
        );
        requireThat(money(row.amount) > 0, "单据金额异常");
        if (next === "paid")
          requireThat(input.receipt_confirmed === true, "请确认已收到实际款项");
        return {
          effects: [
            effect(entity, row, {
              status: next,
              review_note: String(input.review_note || "").slice(0, 500),
              ...(next === "received"
                ? { received_at: new Date().toISOString() }
                : {}),
            }),
          ],
        };
      }
      const withdrawals = await all(client, "Withdrawal", {
          ...ownerQuery(uid),
          ...visible,
        }),
        purchases = await all(client, "PurchaseOrder", {
          ...ownerQuery(uid),
          ...visible,
        });
      requireThat(
        !withdrawals.some(
          (w) =>
            w.status !== "rejected" && !w.transaction_id && !w.legacy_reviewed,
        ) &&
          !purchases.some(
            (p) =>
              p.status !== "rejected" &&
              !p.transaction_id &&
              !p.legacy_reviewed,
          ),
        "历史提现或采购尚未核对，请管理员完成迁移",
        409,
      );
      if (action === "withdraw") {
        const amount = money(input.amount);
        requireThat(amount >= 5000, "最低提现S$50");
        const card = await client.entities.BankCard.get(input.bank_id);
        requireThat(owned(card, uid), "银行卡不属于本人", 403);
        const earned = await earnedBalance(client, uid),
          reserved = withdrawals
            .filter((w) => w.status !== "rejected")
            .reduce((n, w) => n + money(w.amount), 0);
        requireThat(earned - reserved >= amount, "可提现余额不足", 409);
        return {
          drafts: [
            {
              entity: "Withdrawal",
              resultKey: "withdrawal_id",
              data: {
                user_id: uid,
                user_name: user.full_name || user.email,
                amount: amount / 100,
                bank: `${card.bank} ****${card.last4}`,
                status: "pending",
              },
            },
          ],
        };
      }
      requireThat(action === "purchase", "操作无效");
      const dealer = await getAccount(client, uid);
      const rows = await catalog(client, input.items, dealer.tier),
        amount = rows.reduce((s, r) => s + money(r.price) * r.qty, 0);
      requireThat(amount <= 100000000, "采购金额过大");
      if (input.expected_total !== undefined) requireThat(money(input.expected_total) === amount, '拿货价或经销等级已变化，请刷新后确认', 409);
      const active = purchases.filter((p) => p.status !== "rejected"),
        first = active.length === 0;
      requireThat(!first || amount >= 150000, "首次采购最低S$1500");
      const balance = active.reduce(
        (s, p) =>
          s +
          (["paid", "received"].includes(p.status)
            ? money(p.balance_credit)
            : 0) -
          money(p.balance_used),
        0,
      );
      requireThat(balance >= 0, "采购余额异常，请核对历史账目", 409);
      return {
        drafts: [
          {
            entity: "PurchaseOrder",
            resultKey: "order_id",
            data: {
              user_id: uid,
              dealer_name: user.full_name || user.email,
              dealer_tier: dealer.tier,
              items: rows,
              amount: amount / 100,
              is_first: first,
              balance_used:
                !first && input.use_balance
                  ? Math.min(balance, amount) / 100
                  : 0,
              balance_credit: first ? Math.max(0, amount - 150000) / 100 : 0,
              status: "pending",
            },
          },
        ],
      };
    },
  );
}
