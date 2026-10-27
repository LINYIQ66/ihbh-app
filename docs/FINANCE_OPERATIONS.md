# iHBH App — 财务规则与运维说明

本文保留 2026-10-27 修复版本的分润依据、历史账目核对接口、恢复流程及平台验证边界。
项目介绍与本地运行方式见 [README](../README.md)，GitHub 发布准备见 [发布说明](GITHUB_RELEASE.md)。

## Dealer calculation rules verified on 2026-10-27

The user confirmed: the one-time 8% uses the referred dealer's **first completed
sale with actual receipts**; eligible components stack; peer rewards stop at
the nearest three referrers (5%, 3%, 2%). The supplied `官方(1).pdf` and
`总代(1).pdf`, pages 3–4, identify HQ/HBH store as the 8% payer, an Official's
direct Partner as its peer-reward payer, and an Agent's direct Official as its
peer-reward payer. These costs are now negative `reward_cost` entries for the
funding account. All rewards use integer cents, rounded half-up separately per
recipient; the payer debit equals the sum of those rounded rewards.

Partner-to-Partner peer funding is controlled by a **super-admin-only switch**:
HQ or a designated upstream Partner. No default is silently selected. Set
`SUPER_ADMIN_USER_ID` in Base44 secrets to the immutable ID of the designated
admin user (the account must also have built-in role `admin`). Ordinary admins
can view the settings but cannot change them, even by calling the API directly.
Do not expose this setting through a client-editable profile field.

In CRM → dealer administration → “合伙人平级奖励承担方式”, the super admin selects
the mode, records the business reason, and, for designated funding, assigns each
selling Partner an active funding Partner other than themselves. Missing or
inactive funding assignments block the affected settlement. The switch affects
orders confirmed complete after the change; existing order snapshots and
retries keep their original recipients, payer and policy version. The new
`dealerPolicy` function must be published with the rest of this patch.

Product administration now has explicit Partner/Official/Agent procurement
prices and a settlement category. All three valid, ascending prices are
required before enabling dealer purchases; the retail price is never used as
a fallback. The PDF tables confirm Official 300 and Agent 430 per single bottle,
and 1746/2500 and 3420/4900 per set, respectively. Configure actual product IDs
against verified catalog records; do not match products by a display name or
infer Partner prices from these two role brochures.

Each purchase freezes its unit cost/category. Each shipment freezes its exact
purchase-lot allocation. Cancelling one shipment releases those lots only;
later orders keep their original cost. Completion cannot override the frozen
category. GeneCells excludes general channel rebates; inventory withdrawals
with no payment are not paid self-use sales and earn no sales reward.

Settlement is a recoverable series of per-account CAS postings. Funding costs
are processed before recipients; posting and withdrawal share the same User
serialization. An account's negative funding obligations are retained, not
clamped out of earnings; available withdrawal is clamped to zero when necessary.
The ledger view, totals and withdrawal checks exclude incomplete settlements.
This is not an atomic multi-account bank transfer and does not initiate bank
payments. HQ-funded entries record the liability source but do not themselves
debit a linked corporate bank account.

Example: general-product Agent sale, received S$530, cost S$430, with a direct
Official, upstream Partner and three peer referrers. Agent earns S$153; Official
has +S$53 channel share and −S$53 funding expense (net S$0); Partner gets S$53;
peer referrers get S$68.90, S$15.90 and S$10.60 on the first paid sale. The first
referrer's S$68.90 includes S$42.40 paid by HQ. On later sales, no second 8% is
issued. The fourth peer referrer gets zero.

Historical shipments without a verifiable lot assignment block new inventory
transactions. After reviewing original invoices and movements, an administrator
can call `reconcileFinance` with `action: 'inventory'`, `user_id`, `confirmed`,
`reason`, a stable `ref`, and `orders: [{id, stock_allocations:
[{lot_id: '<PURCHASE_ID>:<ZERO_BASED_ITEM_INDEX>', qty, unit_cost_cents}]}]`.
All missing active allocations for that user must be supplied together. The
server verifies quantities, original recorded costs, no batch overuse and known
categories. It will not silently rewrite an incorrect historical cost. Old
completed settlements without the v3 rule snapshot must be reviewed separately;
already posted historical earnings are not automatically recomputed or debited.

## General repair details

- Financial records, membership entitlement, procurement and tickets now reject
  direct client writes. Protected user fields are changed only by server code.
- `transactions.ts` uses Base44's atomic **single plain-ID** `updateMany` CAS to
  commit a canonical resource state and an outbox pointer together. Prepared
  rows are hidden; fixed-ID effects, receipts and revision fences make retries
  recoverable. This does not depend on multi-record transactions or unique
  schema fields, which Base44 does not provide.
- Points, reward limits, game moves, catalog prices, coupons and order totals
  are verified on the server. The UI waits for successful server responses.
  Shop orders now support administrator dispatch and cancellation/refund.
- Transfers debit once and credit the recipient idempotently. A partially
  completed transfer is recovered by retrying the original request or loading
  the sender's summary. Cross-account projections are eventually consistent.
- Withdrawals validate positive amounts, owned bank accounts, reservations and
  complete settlement snapshots. Procurement uses catalog prices and grants
  credit only after payment; ticket issuance verifies capacity/time/provenance.
- Stripe checks the app, buyer, price, quantity, currency, paid status and live
  mode. Test purchases cannot grant live membership or overwrite a paid tier.
- Live sessions check host identity, room identity and bans at connection,
  message and timer boundaries. AI endpoints require login and server quotas;
  photo analysis accepts an uploaded image instead of an arbitrary file URI.
- Case-colliding module filenames, frontend type errors and vulnerable npm
  dependencies were repaired. Unused vulnerable editor dependencies were removed.

## Release prerequisites

Use a separate staging Base44 app and follow the local-development instructions
in [the iHBH App README](../README.md). This workstation has not been linked to the app; Deno/Base44 CLI and
application credentials are not configured. A successful Vite build therefore
does not prove live application startup. The missing `VITE_BASE44_APP_ID`
warning is expected in this unlinked checkout.

Publish entity schemas, shared modules, functions, actors and frontend together
through Git sync and the Base44 dashboard. New entities are `FinancialOperation`
and `SalesOrder`; new functions are `commerce`, `dealerPolicy`, and `reconcileFinance`. Confirm
the target platform supports the documented single-ID atomic CAS and field
permissions before allowing transactions. Do not deploy only the frontend.

Configure secrets in Base44, never in source control:

| Setting | Purpose |
| --- | --- |
| `BASE44_APP_ID` | Correct application identity for Stripe metadata |
| `STRIPE_SECRET_KEY` | Stripe account/environment owning the configured prices |
| `STRIPE_WEBHOOK_SECRET` | Signature secret for this app's webhook endpoint |
| `APP_PUBLIC_ORIGIN` | Trusted HTTPS origin for payment redirects; set explicitly (current fallback is `https://ihbh.kopiagent.ai`) |
| `KOPI_API_KEY` | Existing photo-analysis integration credential |
| `SUPER_ADMIN_USER_ID` | Immutable User ID of the admin allowed to change Partner referral funding |

Verify the fixed price IDs/SGD amounts in `base44/shared/membership.ts` against
the selected Stripe account. Configure checkout completion and asynchronous
payment-success events. Test successful, declined, delayed, duplicated,
out-of-order, test-mode and wrong-buyer events. Stripe refunds/disputes do not
currently revoke membership automatically and require an operational review.

## Required legacy-data reconciliation

Old financial data cannot be assumed trustworthy because previous clients could
write it. Existing points with no canonical server state are blocked until
reviewed. Unreviewed active procurement/withdrawals also block financial actions;
historical tickets and memberships do not automatically receive server trust.
Back up production records and pause financial activity during the cutover.

The `reconcileFinance` function is administrator-only. From an authenticated
administrator SDK session, inspect a user before making changes:

```js
await base44.functions.invoke('reconcileFinance', {
  action: 'preview', user_id: '<USER_ID>'
});
```

Reconcile points **first**, using independently verified ledger/payment records.
The amounts below are placeholders, not a migration policy. Keep a stable `ref`
for each operation and reuse it with identical input if the response is lost:

```js
await base44.functions.invoke('reconcileFinance', {
  action: 'points', user_id: '<USER_ID>',
  balance: 0, lifetime: 0,
  confirmed: true, reason: '<At least 10 characters describing verified evidence>',
  ref: '<STABLE_UUID>'
});
```

Review each old `PurchaseOrder`, `Withdrawal` or `Ticket` separately:

```js
await base44.functions.invoke('reconcileFinance', {
  action: 'document', user_id: '<USER_ID>', entity: 'PurchaseOrder',
  id: '<RECORD_ID>', decision: 'accept', // or 'reject'
  confirmed: true, reason: '<Verified invoice/bank/issuance evidence>',
  ref: '<STABLE_UUID>'
});
```

Acceptance is an explicit administrator attestation, not fraud detection.
Validate ownership, status, quantities, actual paid amounts, available credit,
bank details and prior refunds against original evidence. Invalid historical
amounts must be rejected, not imported. Historical paid tickets are conservatively
imported as payment-due; confirm payment at verification. Imported tickets do not
retroactively grant a points refund.

Recover a historical membership only from a verified Stripe checkout:

```js
await base44.functions.invoke('reconcileFinance', {
  action: 'membership', user_id: '<USER_ID>', session_id: '<STRIPE_SESSION_ID>',
  confirmed: true, reason: '<Verified buyer and original payment evidence>'
});
```

The server retrieves the session and line items and checks ownership and price.
Its Stripe session ID is the idempotency key. Keep migration approvals and
supporting evidence in the release record, including membership reviews.

## Recovery and acceptance testing

If an operation fails after committing, retry with its original reference and
payload. Loading the same resource through the transaction engine finishes its
pending outbox. A prepared record alone does not prove a commit: some are
abandoned drafts from lost races. Never delete an operation or draft until its
resource pointer and receipts have been reconciled. Preserve transaction
history; it supplies replay protection. There is no automatic orphan cleanup.

Before production, test two real accounts concurrently for checkout, transfer,
coupon reuse, procurement, inventory, refunds and withdrawals. Verify schemas
with ordinary-user direct API attempts, admin reviews, Stripe test webhook
delivery, venue/event contention and an active livestream ban. Validate runtime
quotas and uploads on the real platform. Local mocks cannot establish production
RLS/CAS behavior, deployment compatibility, latency or browser behavior.

Livestream moderation stops signaling and cooperative clients stop playback.
Already established peer-to-peer media between malicious clients cannot be
forcibly revoked by a signaling server; a controlled media relay is required for
that guarantee. Manual bank receipts still require administrative verification.
Shop checkout currently supports the existing HBH payment flow, not a new bank
card payment integration. Historical financial repair and deployment have not
been executed by this local patch.
