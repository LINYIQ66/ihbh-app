// A single-record CAS commits state and an outbox pointer together. Effects are
// prepared before the CAS and published by ID, so retries never create twice.
// No leases, multi-record transaction assumptions, or uniqueness assumptions.
export class RequestError extends Error {
  status: number;
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export const requireThat = (condition, message, status = 400) => {
  if (!condition) throw new RequestError(message, status);
};
export const ownerQuery = (id) => ({
  $or: [{ user_id: id }, { created_by_id: id }],
});
export const day = () =>
  new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
export function money(value) {
  const n = Number(value),
    result = Math.round(n * 100);
  requireThat(
    Number.isFinite(n) &&
      n >= 0 &&
      result <= 100000000 &&
      Math.abs(n * 100 - result) < 0.00001,
    "金额必须为非负数，最多两位小数",
  );
  return result;
}
export function requestKey(value) {
  requireThat(
    typeof value === "string" && /^[\w:-]{8,160}$/.test(value),
    "无效的请求编号",
  );
  return value;
}
const items = async (entity, query) =>
  (await entity.filter(query, { limit: 1 })).items;
export async function initialState(
  client,
  entity,
  record,
  allowLegacyReview = false,
) {
  if (record.finance_state) return structuredClone(record.finance_state);
  if (entity !== "User") return {};
  const L = client.entities.PointsLedger;
  const query = { user_id: record.id, transaction_status: { $ne: "prepared" } };
  requireThat(
    allowLegacyReview || !(await L.count(query)),
    "历史积分尚未核对，请管理员完成迁移",
    409,
  );
  const sums = await L.aggregate({ query, sum: ["amount"] });
  const life = await L.aggregate({
    query: {
      ...query,
      amount: { $gt: 0 },
      type: { $nin: ["transfer_in", "adjust"] },
    },
    sum: ["amount"],
  });
  requireThat(!sums.truncated && !life.truncated, "历史账目需要核对", 409);
  const balance = sums.rows?.[0]?.sum_amount || 0;
  requireThat(
    Number.isSafeInteger(balance) && (allowLegacyReview || balance >= 0),
    "历史积分异常，请联系管理员核账",
    409,
  );
  return { balance, lifetime: life.rows?.[0]?.sum_amount || 0 };
}
export async function finish(client, entity, record) {
  if (!record.finance_pending) return;
  const op = await client.entities.FinancialOperation.get(
    record.finance_pending,
  );
  requireThat(
    op.resource_id === record.id && op.resource === entity,
    "交易记录不一致",
    503,
  );
  if (op.status !== "complete") {
    for (const effect of op.effects) {
      // An old replay cannot revert an effect that a later transaction changed.
      await client.entities[effect.entity].updateMany(
        { id: effect.id, ...effect.expected },
        { $set: effect.values },
      );
    }
    await client.entities.FinancialOperation.update(op.id, {
      status: "complete",
    });
  }
  await client.entities[entity].updateMany(
    { id: record.id, finance_pending: op.id },
    { $set: { finance_pending: "" } },
  );
}
export async function snapshot(client, entity, id, allowLegacyReview = false) {
  for (let i = 0; i < 20; i++) {
    const record = await client.entities[entity].get(id);
    if (record.finance_pending) {
      await finish(client, entity, record);
      continue;
    }
    return {
      record,
      state: await initialState(client, entity, record, allowLegacyReview),
    };
  }
  throw new RequestError("交易处理中，请用原请求编号重试", 409);
}
export async function transact(
  client,
  entity,
  id,
  key,
  input,
  plan,
  options = { allowLegacyReview: false },
) {
  requestKey(key);
  const fingerprint = JSON.stringify(input);
  for (let attempt = 0; attempt < 20; attempt++) {
    // Read the resource BEFORE checking receipts: a concurrent commit after this
    // read makes our CAS fail, even if its receipt appears after our receipt read.
    const { record, state } = await snapshot(
      client,
      entity,
      id,
      options.allowLegacyReview,
    );
    const old = (
      await items(client.entities.FinancialOperation, {
        resource: entity,
        resource_id: id,
        key,
        status: "complete",
      })
    )[0];
    if (old) {
      requireThat(
        old.fingerprint === fingerprint,
        "请求编号已用于其他内容",
        409,
      );
      return old.result;
    }
    const next = structuredClone(state);
    const change = await plan(next, record);
    const op = await client.entities.FinancialOperation.create({
      resource: entity,
      resource_id: id,
      key,
      fingerprint,
      status: "prepared",
      effects: [],
      result: {},
    });
    const effects = [],
      result = { ok: true, ...change.result };
    for (const effect of change.effects || []) {
      const row = await client.entities[effect.entity].get(effect.id);
      // Fence stale finalizers even when a status cycles (unused -> used ->
      // unused). A status condition alone cannot distinguish those generations.
      effects.push({
        ...effect,
        expected: {
          ...effect.expected,
          transaction_revision:
            row.transaction_revision === undefined
              ? { $exists: false }
              : row.transaction_revision,
        },
        values: { ...effect.values, transaction_revision: op.id },
      });
    }
    for (const draft of change.drafts || []) {
      const row = await client.entities[draft.entity].create({
        ...draft.data,
        transaction_status: "prepared",
        transaction_id: op.id,
      });
      effects.push({
        entity: draft.entity,
        id: row.id,
        expected: { transaction_status: "prepared", transaction_id: op.id },
        values: { transaction_status: "posted", ...draft.publish },
      });
      if (draft.resultKey) result[draft.resultKey] = row.id;
    }
    await client.entities.FinancialOperation.update(op.id, { effects, result });
    const version = record.finance_version;
    const cas = await client.entities[entity].updateMany(
      {
        id,
        finance_version: version === undefined ? { $exists: false } : version,
        finance_pending:
          record.finance_pending === undefined
            ? { $exists: false }
            : record.finance_pending,
      },
      {
        $set: {
          finance_state: next,
          finance_version: (version || 0) + 1,
          finance_pending: op.id,
        },
      },
    );
    if (cas.updated === 1) {
      await finish(client, entity, { id, finance_pending: op.id });
      return result;
    }
    // Losing drafts stay prepared and are invisible. Never delete on uncertain
    // network failure: the CAS may have committed. Reconcile before cleanup.
  }
  throw new RequestError("操作繁忙，请用原请求编号重试", 409);
}
export function ledger(
  state,
  userId,
  amount,
  type,
  key,
  note,
  counterparty = "",
) {
  requireThat(
    Number.isSafeInteger(amount) &&
      Number.isSafeInteger(state.balance + amount),
    "积分金额无效",
  );
  requireThat(state.balance + amount >= 0, "HBH 余额不足", 409);
  state.balance += amount;
  if (amount > 0 && !["transfer_in", "adjust"].includes(type))
    state.lifetime += amount;
  return {
    entity: "PointsLedger",
    data: {
      user_id: userId,
      amount,
      type,
      idem_key: key,
      note,
      counterparty,
      balance_after: state.balance,
    },
  };
}
export async function all(client, entity, query) {
  const rows = [];
  let cursor;
  do {
    const page = await client.entities[entity].filter(query, {
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    rows.push(...page.items);
    cursor = page.has_more ? page.next_cursor : null;
    requireThat(rows.length < 100000, "账目过多，需要核对汇总", 503);
  } while (cursor);
  return rows;
}
