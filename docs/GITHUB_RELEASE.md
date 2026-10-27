# iHBH App 独立仓库与发布说明

本仓库为用户要求新建、并于 2026-10-27 改为公开的独立仓库，用于保存完整修复成果。仓库地址：https://github.com/LINYIQ66/ihbh-app

- 默认开发基线为 `main`，后续修改通过功能分支与 PR 审查。
- 不修改或替换原 `LINYIQ66/globest-mall` 仓库，也未将新仓库绑定到正式 Base44 应用。
- 原项目中的 48 项测试、类型检查、Lint、构建验证均已通过；本次迁移只调整说明文档和交付资料。
- 真实 Base44／Stripe 集成、超级管理员配置、商品价格与历史数据核对仍须在发布前完成。
- 若未来需要连接 Base44，请先选择独立测试应用；将仓库连接到既有应用会改变代码来源，不能当作单纯的备份操作。

以下保留原仓库在 2026-10-27 的配置检查记录。这里提及的 Base44 Webhook 和原修复分支属于 **原仓库**，不表示新仓库已有相同集成。

---

# GitHub release preparation

Checked on 2026-10-27 (Asia/Singapore).

## Verified repository configuration

- Private repository: `LINYIQ66/globest-mall`.
- Default branch: `main`; remote HEAD at inspection:
  `2344905cab2b80965f17e0271a3e3c7f74108752`.
- Local repair branch: `fix/security-audit`; no remote branch with that name
  existed at inspection.
- GitHub Actions: zero workflows and zero runs.
- One active repository webhook subscribes to `push`, targeting
  `app.base44.com`; last recorded response was HTTP 200. Full webhook addresses
  and credentials are deliberately omitted.
- No GitHub deployment records, environments, or commit checks were returned.
- GitHub Pages returned 404; no Pages site was visible to this credential.
- Branch protection and repository rulesets returned 403. Their state is
  unverified; do not infer that protections are enabled or absent.

The repository contains no Actions workflow or separate Vercel, Netlify,
Cloudflare, Render, Railway, Firebase, or Amplify deployment manifest identified
by the preparation scan. Its package scripts run local development, checks,
tests, and builds; they do not invoke deployment. Base44's project config
defines installation/build/serve commands and `dist` as the output directory.

## Impact on the existing app

[Base44's Git integration documentation](https://docs.base44.com/developers/app-code/local-development/github)
says merging into `main` syncs changes into the Builder, and clicking Publish
makes changes live. On that documented behavior, uploading only
`fix/security-audit` keeps this repair out of the main application source.
The webhook still receives push events; the absence of Actions alone is not
proof that no external service can react. The Base44 dashboard's actual linked
app and any account-level integrations have not been independently verified.

No remote push, merge, publish, webhook change, or production-data change was
performed as part of preparation. The user requested preparation, so the next
remote action remains a separate step.

## Next remote action

1. Recheck remote `main` and the intended repair branch immediately before
   pushing; never force-push over an existing branch.
2. Push the local commit only to `refs/heads/fix/security-audit`, with an explicit
   refspec, and open a draft pull request targeting `main`.
3. Do not enable auto-merge. A draft PR is a review aid, not a deployment lock.
4. Confirm the linked Base44 application and use a separate test app for live
   platform acceptance. Publish schemas, shared code, functions, actors, and
   frontend together only after acceptance.
5. Configure `SUPER_ADMIN_USER_ID`, product tier procurement prices, and the
   remaining secrets from README. Back up and reconcile legacy financial data
   before the production cutover.

## Validation scope

The prepared application changes passed 48 automated tests, frontend typecheck,
ESLint, and Vite build. Tests use platform mocks. Real Base44 permissions/CAS,
Stripe webhooks, and browser end-to-end acceptance remain unverified. Subsequent
preparation edits change documentation only.

Never commit `.env*`, `base44/.app.jsonc`, login credentials, database exports,
private PDFs, `node_modules`, or `dist` as part of this repair.
