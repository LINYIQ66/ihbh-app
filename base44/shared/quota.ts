import { day, transact, requireThat } from "./transactions.ts";
export async function quota(client, user, name, limit) {
  return transact(
    client,
    "User",
    user.id,
    `quota:${crypto.randomUUID()}`,
    { name },
    (state) => {
      state.quotas ||= {};
      const prior = state.quotas[name];
      const q =
        prior?.day === day() ? prior : { day: day(), count: 0, last: 0 };
      requireThat(
        q.count < limit && Date.now() - q.last >= 3000,
        "调用过于频繁或已达今日上限",
        429,
      );
      state.quotas[name] = { day: day(), count: q.count + 1, last: Date.now() };
      return {};
    },
  );
}
