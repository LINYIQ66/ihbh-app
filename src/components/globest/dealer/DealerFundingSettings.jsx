import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { command } from "@/api/commerce";

export default function DealerFundingSettings({ accounts, users }) {
  const qc = useQueryClient();
  const [mode, setMode] = useState(""),
    [target, setTarget] = useState(""),
    [payer, setPayer] = useState(""),
    [reason, setReason] = useState("");
  const query = useQuery({
    queryKey: ["dealer-funding-policy"],
    queryFn: async () =>
      (await base44.functions.invoke("dealerPolicy", { action: "get" })).data,
  });
  const policy = query.data?.policy;
  useEffect(() => {
    setMode(
      policy?.partner_funding === "unconfigured"
        ? ""
        : policy?.partner_funding || "",
    );
  }, [policy?.partner_funding]);
  useEffect(() => {
    setPayer(policy?.payers?.[target] || "");
  }, [target, policy?.payers]);
  const mutation = useMutation({
    mutationFn: /** @param {Record<string,unknown>} values */ (values) =>
      command("dealerPolicy", { ...values, reason, confirmed: true }),
    onSuccess: () => {
      setReason("");
      return qc.invalidateQueries({ queryKey: ["dealer-funding-policy"] });
    },
  });
  const partners = accounts.filter((a) => a.active && a.tier === "partner");
  const label = (id) => users?.find((u) => u.id === id)?.email || id;
  const submit = (values, description) => {
    if (
      window.confirm(
        `${description}\n只影响之后确认完成的订单，历史账目不重算。`,
      )
    )
      mutation.mutate(values);
  };
  const busy = mutation.isPending,
    canSave = reason.trim().length >= 10 && !busy;
  return (
    <section className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <h3 className="font-semibold">合伙人平级奖励承担方式</h3>
      <p className="text-xs text-muted-foreground">
        仅超级管理员可切换。8%
        一次性奖励始终由总部承担；此开关只控制合伙人平级介绍的
        5%／3%／2%。官方由直属合伙人承担，总代由直属官方承担。
      </p>
      {query.isPending && <p>正在读取配置…</p>}
      {query.isError && <p role="alert">配置读取失败：{query.error.message}</p>}
      {policy && (
        <p className="text-sm">
          当前：
          {
            {
              headquarters: "总部承担",
              designated: "指定上级承担",
              unconfigured: "尚未设置（暂不结算合伙人平级奖励）",
            }[policy.partner_funding]
          }{" "}
          · 版本 {policy.version}
        </p>
      )}
      {query.data && !query.data.can_manage && (
        <p className="text-xs text-muted-foreground">
          此账户只有查看权限，请由指定超级管理员设置。
        </p>
      )}
      {query.data?.can_manage && (
        <>
          <label className="block text-sm">
            承担方式
            <select
              disabled={busy}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="ml-2 rounded border bg-card p-2"
            >
              <option value="">请选择</option>
              <option value="headquarters">总部承担，不扣其他合伙人收益</option>
              <option value="designated">指定上级承担，计入该账户支出</option>
            </select>
          </label>
          <label className="block text-sm">
            变更依据与说明
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              minLength={10}
              maxLength={1000}
              className="mt-1 w-full rounded border bg-card p-2"
              placeholder="至少10字，说明本次配置的业务依据"
            />
          </label>
          <button
            type="button"
            disabled={!canSave || !mode}
            onClick={() =>
              submit(
                { action: "set_mode", mode },
                `确认切换为${mode === "headquarters" ? "总部承担" : "指定上级承担"}？`,
              )
            }
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            保存承担方式
          </button>
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-sm font-medium">为合伙人指定承担方</h4>
            <p className="text-xs text-muted-foreground">
              可预先配置；只在“指定上级承担”模式下生效。未指定时阻止该合伙人的相关奖励结算。
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs">
                发生销售的合伙人
                <select
                  value={target}
                  disabled={busy}
                  onChange={(e) => setTarget(e.target.value)}
                  className="mt-1 w-full rounded border bg-card p-2"
                >
                  <option value="">请选择</option>
                  {partners.map((p) => (
                    <option key={p.user_id} value={p.user_id}>
                      {label(p.user_id)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs">
                承担其平级奖励的上级合伙人
                <select
                  value={payer}
                  disabled={busy}
                  onChange={(e) => setPayer(e.target.value)}
                  className="mt-1 w-full rounded border bg-card p-2"
                >
                  <option value="">请选择</option>
                  {payer && !partners.some((p) => p.user_id === payer) && (
                    <option value={payer}>{label(payer)}</option>
                  )}
                  {partners
                    .filter((p) => p.user_id !== target)
                    .map((p) => (
                      <option key={p.user_id} value={p.user_id}>
                        {label(p.user_id)}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              disabled={!canSave || !target || !payer || target === payer}
              onClick={() =>
                submit(
                  {
                    action: "assign_payer",
                    user_id: target,
                    payer_user_id: payer,
                  },
                  `确认由 ${label(payer)} 承担 ${label(target)} 的平级奖励？`,
                )
              }
              className="rounded border px-4 py-2 text-sm disabled:opacity-50"
            >
              保存指定承担方
            </button>
          </div>
        </>
      )}
      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {mutation.error.response?.data?.error || mutation.error.message}
        </p>
      )}
      {mutation.isSuccess && (
        <p role="status" className="text-sm text-primary">
          配置已保存，变更说明与操作者已记录。
        </p>
      )}
    </section>
  );
}
