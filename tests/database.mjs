import assert from "node:assert/strict";
const copy = (v) => structuredClone(v);
function matches(row, q) {
  return Object.entries(q).every(([k, v]) => {
    if (k === "$or") return v.some((x) => matches(row, x));
    if (k === "$and") return v.every((x) => matches(row, x));
    const a = row[k];
    if (v && typeof v === "object" && !Array.isArray(v))
      return Object.entries(v).every(([op, b]) => {
        if (op === "$exists") return (a !== undefined) === b;
        if (op === "$in") return b.includes(a);
        if (op === "$nin") return !b.includes(a);
        if (op === "$ne") return a !== b;
        if (op === "$gte") return a >= b;
        if (op === "$gt") return a > b;
        if (op === "$lte") return a <= b;
        throw Error(`Unknown query ${op}`);
      });
    return a === v;
  });
}
export function db() {
  const tables = {},
    client = { entities: {}, fault: null };
  let serial = 0;
  client.entities = new Proxy(
    {},
    {
      get(_, name) {
        return {
          async get(id) {
            const r = (tables[name] || []).find((r) => r.id === id);
            if (!r) throw Error(`${name} ${id} missing`);
            return copy(r);
          },
          async create(data) {
            const row = {
              ...copy(data),
              id: `${++serial}`.padStart(24, "0"),
              created_date: new Date().toISOString(),
            };
            (tables[name] ||= []).push(row);
            return copy(row);
          },
          async update(id, data) {
            const row = (tables[name] || []).find((r) => r.id === id);
            assert.ok(row);
            Object.assign(row, copy(data));
            return copy(row);
          },
          async updateMany(query, update) {
            assert.equal(
              typeof query.id,
              "string",
              "CAS must target one plain ID",
            );
            if (client.fault?.(name, query, update, "before"))
              throw Error("injected failure");
            let updated = 0;
            for (const row of tables[name] || [])
              if (matches(row, query)) {
                Object.assign(row, copy(update.$set));
                updated++;
              }
            if (client.fault?.(name, query, update, "after"))
              throw Error("lost response");
            return { updated, success: true };
          },
          async filter(query = {}, options = {}) {
            const found = (tables[name] || []).filter((r) => matches(r, query));
            return {
              items: copy(found.slice(0, options.limit || 100)),
              has_more: false,
            };
          },
          async count(query) {
            return (tables[name] || []).filter((r) => matches(r, query)).length;
          },
          async aggregate({ query = {}, sum = [] }) {
            const rows = (tables[name] || []).filter((r) => matches(r, query));
            return {
              rows: [
                Object.fromEntries(
                  sum.map((k) => [
                    `sum_${k}`,
                    rows.reduce((s, r) => s + (r[k] || 0), 0),
                  ]),
                ),
              ],
              truncated: false,
            };
          },
        };
      },
    },
  );
  client.rows = (name) => copy(tables[name] || []);
  client.seed = (name, row) => (tables[name] ||= []).push(copy(row));
  return client;
}
