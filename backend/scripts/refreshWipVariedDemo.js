import { QueryTypes } from 'sequelize';
import db from '../config/db.js';
import WipPlanDia from '../models/WipPlanDia.js';
import { consume, datePlus, toBuckets } from '../services/wipProjectionEngine.js';
import { calculateCurrent, latestCut, readCuts, today } from '../services/wipProjectionService.js';

// One-time correction of the local demo. These are simulated observations,
// deliberately independent of the projected daily arrival and production.
const actualDays = [
  { day: '2026-10-30', arrival: { sfAr: 1510, sf: 2620, f: 3690 }, used: { sfAr: 1800, sf: 3000, f: 3900 } },
  { day: '2026-10-31', arrival: { sfAr: 1380, sf: 2890, f: 4070 }, used: { sfAr: 2000, sf: 2700, f: 4100 } },
  { day: '2026-11-01', arrival: { sfAr: 1450, sf: 2500, f: 3750 }, used: { sfAr: 0, sf: 0, f: 0 } },
  { day: '2026-11-02', arrival: { sfAr: 1605, sf: 3010, f: 3995 }, used: { sfAr: 1900, sf: 2950, f: 4050 } },
  { day: '2026-11-03', arrival: { sfAr: 1320, sf: 2810, f: 3840 }, used: { sfAr: 1850, sf: 2800, f: 4200 } },
];
const plannedArrivals = Array.from({ length: 27 }, (_, i) => 7600 + ((520 + i * 617) % 1150));
const from = '2026-10-31';
const through = '2026-11-04';
const apply = process.argv.includes('--apply');

function sameColumns(records, columns) {
  const pick = (row) => [row.fecha, Number(row.sfAr), Number(row.sf), Number(row.f)];
  return JSON.stringify(records.map(pick).sort()) === JSON.stringify(columns.map(pick).sort());
}

try {
  if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) throw new Error('Solo se permite una base local.');
  if (today() < through) throw new Error('La fecha de prueba aun no ha llegado.');
  await db.authenticate();

  const current = await readCuts('2026-10-30', through);
  const base = current.get('2026-10-30');
  if (!base || [...current.keys()].join(',') !== ['2026-10-30', from, '2026-11-01', '2026-11-02', '2026-11-03', through].join(',')) {
    throw new Error('Los cortes existentes no coinciden con la demostracion original.');
  }
  for (const date of [from, '2026-11-01', '2026-11-02', '2026-11-03', through]) {
    const previous = datePlus(date, -1);
    const forecast = await calculateCurrent(previous);
    const expected = forecast?.blocks.find((block) => block.fecha === date);
    if (!expected || !sameColumns(current.get(date).records, expected.columns)) {
      throw new Error(`El corte ${date} ya fue editado; no se reemplazara.`);
    }
  }

  const plans = await WipPlanDia.findAll({ where: { fecha: plannedArrivals.map((_, i) => datePlus(through, i)) }, raw: true, order: [['fecha', 'ASC']] });
  if (plans.length !== plannedArrivals.length || plans.some((p, i) => p.fecha !== datePlus(through, i) || Number(p.llegada) !== 8046 || Number(p.pctSfAr) !== 18.235234 || Number(p.pctSf) !== 34.134766 || Number(p.pctF) !== 47.63)) {
    throw new Error('La planeacion fue editada; no se reemplazara.');
  }

  let buckets = toBuckets(base.records);
  const replacement = actualDays.map(({ day, arrival, used }) => {
    buckets = consume(buckets, used).buckets;
    const existing = buckets.find((b) => b.fecha === day);
    if (existing) for (const key of ['sfAr', 'sf', 'f']) existing[key] += arrival[key];
    else buckets.push({ fecha: day, ...arrival });
    return { cut: datePlus(day, 1), records: structuredClone(buckets).sort((a, b) => a.fecha.localeCompare(b.fecha)) };
  });
  console.log('Vista previa de cortes simulados variables:');
  for (const { cut, records } of replacement) {
    const totals = records.reduce((s, r) => ({ sfAr: s.sfAr + r.sfAr, sf: s.sf + r.sf, f: s.f + r.f }), { sfAr: 0, sf: 0, f: 0 });
    console.log(`${cut}: SF AR ${totals.sfAr}, SF ${totals.sf}, F ${totals.f}; WIP ${totals.sfAr + totals.sf + totals.f}`);
  }
  console.log('Entradas planeadas 4-10 nov:', plannedArrivals.slice(0, 7).join(', '));
  console.log('Se variaran las entradas planeadas hasta el 30 nov.');
  if (!apply) console.log('Vista previa. Agrega --apply para reemplazar los datos de prueba.');
  else {
    await db.transaction(async (transaction) => {
      const before = await db.query(`SELECT id, DATE_FORMAT(fecha_insercion, '%Y-%m-%d') AS corte,
        DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, nvi_ar_semi AS sfAr, nvi_sin_ar_semi AS sf, nvi_total_term AS f
        FROM resumen_nvis WHERE fecha_insercion >= :from AND fecha_insercion < :end FOR UPDATE`, {
        replacements: { from, end: datePlus(through, 1) }, type: QueryTypes.SELECT, transaction,
      });
      if (before.length !== [...current.values()].filter((c) => c.fecha >= from).reduce((n, c) => n + c.records.length, 0) ||
          replacement.some(({ cut }) => !sameColumns(before.filter((r) => r.corte === cut), current.get(cut).records))) {
        throw new Error('Los cortes cambiaron mientras se preparaba la correccion.');
      }
      await db.query('DELETE FROM resumen_nvis WHERE id IN (:ids)', {
        replacements: { ids: before.map((r) => r.id) }, transaction,
      });
      for (const { cut, records } of replacement) for (const r of records) {
        await db.query(`INSERT INTO resumen_nvis
          (fecha, fecha_insercion, hora_insercion, nvi_en_proceso, nvi_total_term, nvi_total_ster,
           nvi_ar_semi, nvi_sin_ar_semi, nvi_ar_term, nvi_sin_ar_term, nvi_con_ar, nvi_sin_ar)
          VALUES (:fecha, :cut, '00:00:00', :total, :f, :ster, :sfAr, :sf, 0, :f, :sfAr, :sinAr)`, {
          replacements: { fecha: r.fecha, cut, total: r.sfAr + r.sf + r.f, f: r.f,
            ster: r.sfAr + r.sf, sfAr: r.sfAr, sf: r.sf, sinAr: r.sf + r.f }, transaction,
        });
      }
      for (let i = 0; i < plannedArrivals.length; i += 1) {
        await WipPlanDia.update({ llegada: plannedArrivals[i] }, {
          where: { fecha: datePlus(through, i), llegada: 8046 }, transaction,
        });
      }
    });
    console.log('Cortes y planeacion de prueba actualizados.');
  }
} catch (error) {
  console.error('No se modificaron datos:', error.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
