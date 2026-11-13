import test from 'node:test';
import assert from 'node:assert/strict';
import { project, validatePlan, datePlus, consume, incoming } from '../services/wipProjectionEngine.js';
import checkWipAccess from '../middleware/checkWipAccess.js';

const plan = (fecha, changes = {}) => ({ fecha, llegada: 8046, metaSfAr: 1924, metaSf: 2883, metaF: 4193, pctSfAr: 18.235234, pctSf: 34.134766, pctF: 47.63, ...changes });
const dates = ['2026-08-31', '2026-08-30', '2026-08-29', '2026-08-28', '2026-08-27', '2026-08-26', '2026-08-25', '2026-08-24'];
const ar = [1295, 251, 1502, 1449, 978, 695, 38, 10];
const sf = [2923, 496, 3376, 3314, 2318, 2101, 238, 7];
const f = [2768, 54, 216, 99, 30, 34, 32, 0];
const cut = { fecha: '2026-09-01', sourceWip: 24224, records: dates.map((fecha, i) => ({ fecha, sfAr: ar[i], sf: sf[i], f: f[i] })) };

test('reproduces September 2 with the effective first-day production shown by the Excel results', () => {
  const result = project(cut, [plan('2026-09-01', { metaSfAr: 1200, metaSf: 3600, metaF: 4200 })], 1);
  assert.equal(result.blocks[0].total, 24224);
  assert.deepEqual(result.blocks[1].totals, { sfAr: 6485, sf: 13919, f: 3832 });
  assert.equal(result.blocks[1].total, 24236);
  assert.equal(result.blocks[1].columns.find((c) => c.fecha === '2026-08-27').sfAr, 521);
  assert.equal(result.blocks[1].columns.find((c) => c.fecha === '2026-08-27').sf, 1064);
  assert.deepEqual(result.blocks[0].movement.used, { sfAr: 1200, sf: 3600, f: 3233 });
  assert.equal(result.blocks[0].movement.rounding, 1);
});

test('uses entered production of 3000 without silently changing it to match Excel', () => {
  const result = project(cut, [plan('2026-09-01', { metaSfAr: 1200, metaSf: 3000, metaF: 4200 })], 1);
  assert.equal(result.blocks[1].totals.sf, 14519);
  assert.equal(result.blocks[1].columns.find((c) => c.fecha === '2026-08-27').sf, 1664);
});

test('keeps every real source date, including the older August 14 row', () => {
  const withOld = { ...cut, sourceWip: 24642, records: [...cut.records, { fecha: '2026-08-14', sfAr: 19, sf: 153, f: 246 }] };
  const result = project(withOld, [], 30);
  assert.equal(result.blocks[0].total, 24642);
  assert.equal(result.blocks[0].columns.length, 9);
  assert.equal(result.missingDate, '2026-09-01');
});

test('zero-production day ages outstanding work without consuming it', () => {
  const result = project(cut, [plan('2026-09-01', { llegada: 0, metaSfAr: 0, metaSf: 0, metaF: 0 })], 1);
  assert.equal(result.blocks[1].total, result.blocks[0].total);
  assert.equal(result.blocks[1].columns[0].age, 2);
});

test('stops at a missing plan rather than inventing zero input or skipping a date', () => {
  const result = project(cut, [plan('2026-09-01'), plan('2026-09-03')], 30);
  assert.equal(result.blocks.length, 2);
  assert.equal(result.missingDate, '2026-09-02');
});

test('cannot consume more than the available category and does not spend spare production on new arrivals', () => {
  const result = project({ fecha: '2026-09-01', records: [{ fecha: '2026-08-31', sfAr: 1, sf: 1, f: 1 }] }, [plan('2026-09-01')], 1);
  assert.deepEqual(result.blocks[0].movement.used, { sfAr: 1, sf: 1, f: 1 });
  assert.equal(result.blocks[1].total, 8045);
  assert.deepEqual(consume([], { sfAr: 3, sf: 4, f: 5 }), { buckets: [], used: { sfAr: 0, sf: 0, f: 0 } });
});

test('validates numbers, dates, percentages, and distinguishes missing from explicit zero', () => {
  assert.throws(() => validatePlan(plan('2026-02-30')));
  assert.throws(() => validatePlan(plan('2026-09-01', { llegada: '' })));
  assert.throws(() => validatePlan(plan('2026-09-01', { metaF: -1 })));
  assert.throws(() => validatePlan(plan('2026-09-01', { metaSf: 1.5 })));
  assert.throws(() => validatePlan(plan('2026-09-01', { pctF: 40 })));
  assert.equal(validatePlan(plan('2026-09-01', { llegada: 0 })).llegada, 0);
  assert.deepEqual(incoming(plan('2026-09-01')), { sfAr: 1467, sf: 2746, f: 3832 });
});

test('handles year and leap-day boundaries without local timezone shifts', () => {
  assert.equal(datePlus('2026-12-31', 1), '2027-01-01');
  assert.equal(datePlus('2028-02-28', 1), '2028-02-29');
  assert.equal(datePlus('2026-02-28', 1), '2026-03-01');
});

test('rejects ambiguous source dates instead of double-counting a duplicate run', () => {
  assert.throws(() => project({ ...cut, records: [...cut.records, cut.records[0]] }, [], 1));
});

test('allows authenticated report users on the backend', () => {
  let code;
  let allowed = false;
  const res = { status(value) { code = value; return this; }, json() {} };
  checkWipAccess({}, res, () => { allowed = true; });
  assert.equal(code, 401);
  assert.equal(allowed, false);
  checkWipAccess({ usuario: { rol: 'operador' } }, res, () => { allowed = true; });
  assert.equal(allowed, true);
  allowed = false;
  checkWipAccess({ usuario: { rol: 'admin' } }, res, () => { allowed = true; });
  assert.equal(allowed, true);
});
