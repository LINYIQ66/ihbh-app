import test from 'node:test';
import assert from 'node:assert/strict';
import { allocations, chain } from '../base44/shared/dealerMath.ts';
import { postSettlement } from '../base44/shared/dealerSettlement.ts';
import { db } from './database.mjs';

for (const tier of ['partner', 'official', 'agent']) {
  test(`${tier}: A/B/C/D receipts pay only the nearest three; all 8% fees belong to the experience hall`, async () => {
    const c = db();
    const ids = ['original', 'A', 'B', 'C', 'D'];
    for (let i = 0; i < ids.length; i++) c.seed('DealerAccount', {
      id: `account-${ids[i]}`, user_id: ids[i], tier, active: true,
      referrer_user_id: ids[i - 1] || '',
    });
    const parents = tier === 'partner' ? [] : tier === 'official'
      ? [{ user_id: 'direct-partner', tier: 'partner' }]
      : [{ user_id: 'direct-official', tier: 'official' }, { user_id: 'outer-partner', tier: 'partner' }];
    const expected = [
      [['original', 5000]],
      [['A', 5000], ['original', 3000]],
      [['B', 5000], ['A', 3000], ['original', 2000]],
      [['C', 5000], ['B', 3000], ['A', 2000]],
    ];
    for (let i = 1; i < ids.length; i++) {
      const seller = { user_id: ids[i], tier, referrer_user_id: ids[i - 1], referral_funding: 'headquarters' };
      const referrers = await chain(c, seller, 'referrer_user_id', 3);
      const input = { seller, parents, referrers, received: 100000, cost: 60000, category: 'genecells', first: true };
      const rows = allocations(input);
      assert.deepEqual(rows.filter(r => r.component === 'downline').map(r => [r.user_id, r.amount_cents]), expected[i - 1]);
      const bonus = rows.find(r => r.component === 'referral');
      assert.equal(bonus.user_id, ids[i - 1]);
      assert.equal(bonus.amount_cents, 8000);
      assert.equal(bonus.payer_kind, 'experience_hall');
      const debit = rows.find(r => r.component === 'reward_cost');
      if (parents.length) {
        assert.equal(debit.user_id, parents[0].user_id);
        assert.equal(debit.amount_cents, -expected[i - 1].reduce((n, r) => n + r[1], 0));
      } else assert.equal(debit, undefined);
      assert.ok(!allocations({ ...input, first: false }).some(r => r.component === 'referral'));
    }
  });
}

test('vertical tier sales earn their actual price spread without inventing a peer referral', () => {
  for (const [tier, cost, received, expected] of [
    ['partner', 16000, 30000, 14000],
    ['partner', 16000, 43000, 27000],
    ['official', 30000, 43000, 13000],
    ['agent', 43000, 53000, 10000],
  ]) {
    const rows = allocations({ seller: { user_id: 'seller', tier }, cost, received, category: 'genecells', first: true });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].component, 'margin');
    assert.equal(rows[0].amount_cents, expected);
  }
});

test('v3 and v4 pending settlements preserve their frozen 8% payer across recovery and replay', async () => {
  for (const [version, payer] of [['dealer-v3-2026-10-27', 'headquarters'], ['dealer-v4-2026-10-27', 'experience_hall']]) {
    const c = db();
    c.seed('User', { id: 'referrer', finance_state: {} });
    const rows = [{ user_id: 'referrer', component: 'referral', amount_cents: 8000, rate: 8, note: `Frozen ${payer}`, payer_kind: payer, payer_user_id: '' }];
    c.seed('ShipOrder', { id: 'sale', dealer_user_id: 'seller', name: 'Product', qty: 1, cost_amount: 600, received_amount: 1000, completed_at: '2026-10-27T03:00:00Z', status: 'completed', settlement_state: 'pending', settlement_rule_version: version, settlement_snapshot: rows });
    await postSettlement(c, 'sale');
    await postSettlement(c, 'sale');
    const earnings = c.rows('Earning').filter(r => r.transaction_status === 'posted');
    assert.equal(earnings.length, 1);
    assert.equal(earnings[0].payer_kind, payer);
    assert.equal(earnings[0].amount, 80);
    assert.deepEqual((await c.entities.ShipOrder.get('sale')).settlement_snapshot, rows);
  }
});
