import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { base44 } from "@/api/base44Client";
import { command } from "@/api/commerce";
const Context = createContext(null);
export const HBH_RATE = 0.1;
export const SHOP_REWARD = 0.5;
export const toHbh = (sgd) => Math.ceil(Math.round(Number(sgd) * 100) / 10);
const initial = {
  lang: "zh",
  hbh: 0,
  solano: 0,
  cart: [],
  claims: [],
  board: [1, 1, 0, 0, 0, 0, 0, 0, 0],
  merges: 0,
  customers: [],
  orders: [],
  reminders: [],
  referral: "",
  favorites: [],
};
const today = () =>
  new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
function cached(id) {
  try {
    const value = JSON.parse(localStorage.getItem(`globest-ui:${id}`) || "{}");
    return {
      lang: value.lang === "en" ? "en" : "zh",
      cart: Array.isArray(value.cart) ? value.cart : [],
      favorites: Array.isArray(value.favorites) ? value.favorites : [],
    };
  } catch {
    return {};
  }
}
export default function ExperienceProvider({ children }) {
  const [state, setState] = useState(initial),
    [notice, setNotice] = useState("");
  const identity = useRef("guest"),
    timer = useRef(null);
  const t = (zh, en) => (state.lang === "zh" ? zh : en);
  const notify = (text) => {
    setNotice(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 3500);
  };
  const update = (fn) =>
    setState((prev) => {
      const next = typeof fn === "function" ? fn(prev) : { ...prev, ...fn };
      localStorage.setItem(
        `globest-ui:${identity.current}`,
        JSON.stringify({
          lang: next.lang,
          cart: next.cart,
          favorites: next.favorites,
        }),
      );
      return next;
    });
  const refresh = async () => {
    const id = identity.current;
    if (id === "guest") return;
    const { data } = await base44.functions.invoke("pointsLedger", {
      action: "summary",
    });
    if (identity.current !== id) return;
    setState((s) => ({
      ...s,
      hbh: data.balance,
      board: data.board,
      merges: data.merges,
      orders: data.orders,
      claims: data.checkedIn
        ? [...new Set([...s.claims, `daily:${today()}`])]
        : s.claims,
    }));
  };
  useEffect(() => {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.title =
      state.lang === "zh"
        ? "Globest Mall · 中华滋补，环球健康"
        : "Globest Mall · Eastern Roots. Global Wellness.";
  }, [state.lang]);
  useEffect(() => {
    let disposed = false,
      off;
    const sync = async () => {
      try {
        const me = await base44.auth.me().catch(() => null);
        if (disposed) return;
        const id = me?.id || "guest";
        if (identity.current !== id) {
          off?.();
          identity.current = id;
          setState({ ...initial, ...cached(id) });
          if (me)
            off = base44.entities.PointsLedger.subscribe(() =>
              refresh().catch(() => {}),
            );
        }
        if (me) await refresh();
      } catch (e) {
        if (!disposed) notify(e.response?.data?.error || e.message);
      }
    };
    sync();
    window.addEventListener("focus", sync);
    return () => {
      disposed = true;
      off?.();
      clearTimeout(timer.current);
      window.removeEventListener("focus", sync);
    };
  }, []);
  const server = async (payload) => {
    if (identity.current === "guest") {
      notify(t("请先登录后操作", "Please sign in first"));
      return null;
    }
    const id = identity.current;
    try {
      const result = await command("pointsLedger", payload);
      if (identity.current !== id) return null;
      await refresh().catch(() => {});
      return result;
    } catch (e) {
      notify(e.response?.data?.error || e.message);
      return null;
    }
  };
  const claim = async (key) => {
    const result = await server(
      key === "daily" ? { action: "checkin" } : { action: "earn", key },
    );
    if (!result) return false;
    update((s) => ({
      ...s,
      claims: [...new Set([...s.claims, `${key}:${today()}`])],
    }));
    notify(t(`已获得 ${result.amount} HBH`, `Earned ${result.amount} HBH`));
    return true;
  };
  const readStart = (article_id) =>
    server({ action: "read_start", article_id });
  const claimed = (key) => state.claims.includes(`${key}:${today()}`);
  const addCart = (product) => {
    update((s) => {
      const found = s.cart.find((p) => p.id === product.id);
      return {
        ...s,
        cart: found
          ? s.cart.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
            )
          : [...s.cart, { ...product, quantity: 1 }],
      };
    });
    notify(t("已加入购物车", "Added to cart"));
  };
  const checkout = async (
    items,
    coupon_id = "",
    expected_total = items.reduce(
      (n, p) => n + Number(p.price) * (p.quantity || 1),
      0,
    ),
  ) => {
    const result = await server({
      action: "checkout",
      items: items.map((p) => ({ id: p.id, quantity: p.quantity || 1 })),
      coupon_id,
      expected_total: Math.round(expected_total * 100) / 100,
    });
    if (result) notify(t("订单已支付", "Order paid"));
    return result;
  };
  const redeem = (gift_id) => server({ action: "redeem", gift_id });
  const gameMove = (move) => server({ action: "game", ...move });
  // Demo booking widgets do not have a server-priced product and cannot spend.
  const spendHbh = () => {
    notify(
      t(
        "请通过商城订单或积分兑换支付",
        "Please use checkout or points redemption",
      ),
    );
    return false;
  };
  const pick = (p) => ({
    id: p.id,
    name_zh: p.name_zh,
    name_en: p.name_en,
    price: Number(p.price),
    image: p.image,
    quantity: p.quantity || 1,
  });
  const toggleFavorite = (p) => {
    const on = state.favorites.some((f) => f.id === p.id);
    update((s) => ({
      ...s,
      favorites: on
        ? s.favorites.filter((f) => f.id !== p.id)
        : [pick(p), ...s.favorites],
    }));
    notify(
      t(
        on ? "已取消收藏" : "已加入收藏",
        on ? "Removed from favorites" : "Saved",
      ),
    );
  };
  return (
    <Context.Provider
      value={{
        state,
        update,
        t,
        claim,
        claimed,
        notify,
        addCart,
        spendHbh,
        checkout,
        redeem,
        gameMove,
        readStart,
        refresh,
        toggleFavorite,
      }}
    >
      {children}
      {notice && (
        <div role="status" className="notice">
          {notice}
        </div>
      )}
    </Context.Provider>
  );
}
export const useExperience = () => useContext(Context);
