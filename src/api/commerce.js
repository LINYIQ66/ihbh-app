import { base44 } from "./base44Client";
const inFlight = new Map();
export async function command(name, payload) {
  const me = await base44.auth.me();
  if (!me) throw new Error("请先登录");
  const fingerprint = JSON.stringify([me.id, name, payload]);
  if (inFlight.has(fingerprint)) return inFlight.get(fingerprint);
  const run = (async () => {
    const storageKey = `globest-request:${fingerprint}`;
    let ref = sessionStorage.getItem(storageKey);
    if (!ref) {
      ref = crypto.randomUUID();
      sessionStorage.setItem(storageKey, ref);
    }
    const { data } = await base44.functions.invoke(name, { ...payload, ref });
    if (data?.ok === false || data?.error)
      throw new Error(data.error || data.reason);
    sessionStorage.removeItem(storageKey);
    return data;
  })();
  inFlight.set(fingerprint, run);
  try {
    return await run;
  } finally {
    inFlight.delete(fingerprint);
  }
}
