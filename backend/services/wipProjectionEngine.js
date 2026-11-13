import moment from 'moment-timezone';

export const ZONE = 'America/Mexico_City';
export const CATEGORIES = ['sfAr', 'sf', 'f'];
export const DEFAULT_PERCENTAGES = { sfAr: 18.235234, sf: 34.134766, f: 47.63 };
export const datePlus = (date, days) => moment.utc(date, 'YYYY-MM-DD', true).add(days, 'days').format('YYYY-MM-DD');
export const validDate = (value) => typeof value === 'string' && moment(value, 'YYYY-MM-DD', true).isValid();

export function validatePlan(row) {
  if (!validDate(row.fecha)) throw new Error('Fecha de planeacion invalida');
  for (const key of ['llegada', 'metaSfAr', 'metaSf', 'metaF']) {
    if (row[key] === '' || row[key] === null || !Number.isSafeInteger(Number(row[key])) || Number(row[key]) < 0 || Number(row[key]) > 10000000) {
      throw new Error(`${row.fecha}: ${key} debe ser un entero entre 0 y 10,000,000`);
    }
  }
  const p = ['pctSfAr', 'pctSf', 'pctF'].map((key) => row[key]);
  if (p.some((x) => x === '' || x === null || !Number.isFinite(Number(x)) || Number(x) < 0 || Number(x) > 100) || Math.abs(p.reduce((sum, x) => sum + Number(x), 0) - 100) > 0.000001) {
    throw new Error(`${row.fecha}: los porcentajes deben sumar 100%`);
  }
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, key === 'fecha' ? value : Number(value)]));
}

export function incoming(plan) {
  return Object.fromEntries(CATEGORIES.map((key) => [key, Math.floor(plan.llegada * Math.round(plan[`pct${key[0].toUpperCase()}${key.slice(1)}`] * 1000000) / 100000000)]));
}

export function toBuckets(records) {
  const seen = new Set();
  return records.map((r) => {
    if (!validDate(r.fecha) || seen.has(r.fecha)) throw new Error('El corte contiene fechas invalidas o duplicadas');
    seen.add(r.fecha);
    const bucket = { fecha: r.fecha };
    for (const key of CATEGORIES) {
      const value = Number(r[key] ?? 0);
      if (!Number.isSafeInteger(value) || value < 0) throw new Error('El corte contiene cantidades invalidas');
      bucket[key] = value;
    }
    return bucket;
  }).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function consume(buckets, goals) {
  const result = buckets.map((b) => ({ ...b })).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const used = { sfAr: 0, sf: 0, f: 0 };
  for (const key of CATEGORIES) {
    let remaining = goals[key];
    for (const bucket of result) {
      const quantity = Math.min(bucket[key], remaining);
      bucket[key] -= quantity;
      remaining -= quantity;
      used[key] += quantity;
    }
  }
  return { buckets: result.filter((b) => CATEGORIES.some((k) => b[k] > 0)), used };
}

export function makeBlock(fecha, buckets, plan, real = false) {
  const columns = [...buckets].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((b) => ({
    ...b, age: moment.utc(fecha).diff(moment.utc(b.fecha), 'days'),
    total: CATEGORIES.reduce((s, k) => s + b[k], 0),
  }));
  const totals = Object.fromEntries(CATEGORIES.map((key) => [key, columns.reduce((s, c) => s + c[key], 0)]));
  return { fecha, real, columns, totals, total: CATEGORIES.reduce((s, k) => s + totals[k], 0), plan: plan || null };
}

export function project(cut, plans, days = 30) {
  let buckets = toBuckets(cut.records);
  if (buckets.some((b) => b.fecha > cut.fecha)) throw new Error('El corte contiene trabajo de una fecha futura');
  const byDate = new Map(plans.map((p) => [p.fecha, validatePlan(p)]));
  const blocks = [makeBlock(cut.fecha, buckets, byDate.get(cut.fecha), true)];
  let missingDate = null;
  const appliedPlans = [];
  for (let i = 0; i < days; i += 1) {
    const fecha = datePlus(cut.fecha, i);
    const plan = byDate.get(fecha);
    if (!plan) { missingDate = fecha; break; }
    const goals = { sfAr: plan.metaSfAr, sf: plan.metaSf, f: plan.metaF };
    const entry = incoming(plan);
    const result = consume(buckets, goals);
    blocks[blocks.length - 1].movement = { arrival: entry, plannedArrival: plan.llegada, rounding: plan.llegada - CATEGORIES.reduce((s, k) => s + entry[k], 0), goals, used: result.used };
    buckets = result.buckets;
    const sameDate = buckets.find((b) => b.fecha === fecha);
    if (sameDate) CATEGORIES.forEach((k) => { sameDate[k] += entry[k]; });
    else if (CATEGORIES.some((k) => entry[k] > 0)) buckets.push({ fecha, ...entry });
    appliedPlans.push(plan);
    blocks.push(makeBlock(datePlus(fecha, 1), buckets, byDate.get(datePlus(fecha, 1))));
  }
  return { cut: { fecha: cut.fecha, hora: '00:00:00', sourceWip: cut.sourceWip, records: cut.records }, blocks, appliedPlans, missingDate, days, calculatedAt: new Date().toISOString() };
}
