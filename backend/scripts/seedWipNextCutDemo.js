import { QueryTypes } from 'sequelize';
import db from '../config/db.js';
import WipPlanDia from '../models/WipPlanDia.js';
import { consume, datePlus, toBuckets, validDate } from '../services/wipProjectionEngine.js';
import { latestCut, today } from '../services/wipProjectionService.js';

const args = process.argv.slice(2);
const dateIndex = args.indexOf('--date');
const targetDate = dateIndex < 0 ? null : args[dateIndex + 1];
const apply = args.includes('--apply');

try {
  if (!validDate(targetDate)) throw new Error('Uso: node scripts/seedWipNextCutDemo.js --date YYYY-MM-DD [--apply]');
  if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) {
    throw new Error('El script solo acepta una base local.');
  }
  if (targetDate > today()) throw new Error('No se puede crear un corte de prueba para una fecha futura.');

  await db.authenticate();
  const previous = await latestCut();
  if (!previous || datePlus(previous.fecha, 1) !== targetDate) {
    throw new Error('La fecha indicada debe ser el dia siguiente al ultimo corte de las 00:00.');
  }
  const [existing] = await db.query(
    'SELECT COUNT(*) AS n FROM resumen_nvis WHERE fecha_insercion >= :start AND fecha_insercion < :end',
    { replacements: { start: targetDate, end: datePlus(targetDate, 1) }, type: QueryTypes.SELECT },
  );
  if (Number(existing.n) > 0) throw new Error(`La fecha ${targetDate} ya tiene ${existing.n} registros. No se insertaron datos.`);

  const plan = await WipPlanDia.findByPk(previous.fecha, { raw: true });
  if (!plan) throw new Error('Falta la planeacion del dia anterior.');

  // Simulate an observation independently from the forecast. The same date
  // always generates the same test values, but they differ from day to day.
  const seed = Number(previous.fecha.replaceAll('-', ''));
  const actualArrival = Math.round(Number(plan.llegada) * (0.94 + (seed % 11) * 0.012));
  const pctSfAr = Number(plan.pctSfAr) + ((seed % 7) - 3) * 0.6;
  const pctSf = Number(plan.pctSf) + ((seed % 5) - 2) * 0.8;
  const arrival = {
    sfAr: Math.floor(actualArrival * pctSfAr / 100),
    sf: Math.floor(actualArrival * pctSf / 100),
  };
  arrival.f = actualArrival - arrival.sfAr - arrival.sf;
  const goals = {
    sfAr: Math.round(Number(plan.metaSfAr) * (0.9 + (seed % 5) * 0.05)),
    sf: Math.round(Number(plan.metaSf) * (0.9 + (seed % 7) * 0.03)),
    f: Math.round(Number(plan.metaF) * (0.92 + (seed % 6) * 0.035)),
  };
  const consumed = consume(toBuckets(previous.records), goals);
  const buckets = consumed.buckets;
  const newBucket = buckets.find((bucket) => bucket.fecha === previous.fecha);
  if (newBucket) for (const key of ['sfAr', 'sf', 'f']) newBucket[key] += arrival[key];
  else buckets.push({ fecha: previous.fecha, ...arrival });
  const next = buckets.sort((a, b) => a.fecha.localeCompare(b.fecha)).map((bucket) => ({
    ...bucket, total: bucket.sfAr + bucket.sf + bucket.f,
  }));
  if (next.some((column) => column.fecha >= targetDate)) throw new Error('El corte contiene fechas de trabajo invalidas.');
  const sum = next.reduce((total, column) => total + column.total, 0);

  console.log(`Corte sintetico independiente: ${targetDate} 00:00:00; base: ${previous.fecha}.`);
  console.log(`Produccion simulada: ${JSON.stringify(consumed.used)}; entrada simulada: ${JSON.stringify(arrival)}.`);
  console.log(`Filas: ${next.length}; WIP: ${sum}.`);
  if (!apply) console.log('Vista previa. Agrega --apply para insertar.');
  else {
    await db.transaction(async (transaction) => {
      const [stillEmpty] = await db.query(
        'SELECT COUNT(*) AS n FROM resumen_nvis WHERE fecha_insercion >= :start AND fecha_insercion < :end FOR UPDATE',
        { replacements: { start: targetDate, end: datePlus(targetDate, 1) }, type: QueryTypes.SELECT, transaction },
      );
      if (Number(stillEmpty.n) > 0) throw new Error('El dia ya contiene registros.');
      for (const column of next) {
        await db.query(`INSERT INTO resumen_nvis
          (fecha, fecha_insercion, hora_insercion, nvi_en_proceso, nvi_total_term, nvi_total_ster,
           nvi_ar_semi, nvi_sin_ar_semi, nvi_ar_term, nvi_sin_ar_term, nvi_con_ar, nvi_sin_ar)
          VALUES (:fecha, :cutDate, '00:00:00', :total, :f, :ster, :sfAr, :sf, 0, :f, :sfAr, :sinAr)`, {
          replacements: {
            fecha: column.fecha, cutDate: targetDate, total: column.total,
            f: column.f, ster: column.sfAr + column.sf, sfAr: column.sfAr,
            sf: column.sf, sinAr: column.sf + column.f,
          }, transaction,
        });
      }
    });
    console.log(`Insertadas ${next.length} filas sinteticas para ${targetDate}.`);
  }
} catch (error) {
  console.error('No se pudo crear el corte de prueba:', error.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
