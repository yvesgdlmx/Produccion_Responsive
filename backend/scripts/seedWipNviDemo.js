import { QueryTypes } from 'sequelize';
import db from '../config/db.js';
import { datePlus, validDate } from '../services/wipProjectionEngine.js';

const args = process.argv.slice(2);
const dateIndex = args.indexOf('--date');
const cutDate = dateIndex >= 0 ? args[dateIndex + 1] : null;
const apply = args.includes('--apply');

if (!validDate(cutDate)) {
  console.error('Uso: node scripts/seedWipNviDemo.js --date YYYY-MM-DD [--apply]');
  process.exitCode = 1;
} else if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) {
  console.error('Este script solo acepta una base local. No se insertaron registros.');
  process.exitCode = 1;
} else {
  try {
    await db.authenticate();
    const [existing] = await db.query(
      'SELECT COUNT(*) AS n FROM resumen_nvis WHERE fecha_insercion = :cutDate',
      { replacements: { cutDate }, type: QueryTypes.SELECT },
    );
    if (Number(existing.n) > 0) {
      console.error(`La fecha ${cutDate} ya tiene ${existing.n} filas en resumen_nvis. No se insertaron registros.`);
      process.exitCode = 1;
    } else {
      const demo = [
        { days: 1, sfAr: 1295, sf: 2923, f: 2768 },
        { days: 2, sfAr: 251, sf: 496, f: 54 },
        { days: 3, sfAr: 1502, sf: 3376, f: 216 },
        { days: 4, sfAr: 1449, sf: 3314, f: 99 },
        { days: 5, sfAr: 978, sf: 2318, f: 30 },
        { days: 6, sfAr: 695, sf: 2101, f: 34 },
        { days: 7, sfAr: 38, sf: 238, f: 32 },
        { days: 8, sfAr: 10, sf: 7, f: 0 },
        { days: 18, sfAr: 19, sf: 153, f: 246 },
      ].map((item) => ({ ...item, fecha: datePlus(cutDate, -item.days) }));
      console.log(`Corte de prueba: ${cutDate} 00:00:00`);
      console.log(`Filas: ${demo.length}; WIP: ${demo.reduce((sum, r) => sum + r.sfAr + r.sf + r.f, 0)}; fechas de trabajo: ${demo.at(-1).fecha} a ${demo[0].fecha}`);
      if (!apply) {
        console.log('Vista previa. Agrega --apply para insertar estas filas.');
      } else {
        await db.transaction(async (transaction) => {
          const [stillEmpty] = await db.query(
            'SELECT COUNT(*) AS n FROM resumen_nvis WHERE fecha_insercion = :cutDate FOR UPDATE',
            { replacements: { cutDate }, type: QueryTypes.SELECT, transaction },
          );
          if (Number(stillEmpty.n) !== 0) throw new Error('La fecha ya contiene registros');
          for (const r of demo) {
            await db.query(`INSERT INTO resumen_nvis
              (fecha, fecha_insercion, hora_insercion, nvi_en_proceso, nvi_total_term, nvi_total_ster,
               nvi_ar_semi, nvi_sin_ar_semi, nvi_ar_term, nvi_sin_ar_term, nvi_con_ar, nvi_sin_ar)
              VALUES (:fecha, :cutDate, '00:00:00', :total, :f, :ster, :sfAr, :sf, 0, :f, :sfAr, :sinAr)`, {
              replacements: {
                fecha: r.fecha, cutDate, total: r.sfAr + r.sf + r.f,
                f: r.f, ster: r.sfAr + r.sf, sfAr: r.sfAr, sf: r.sf, sinAr: r.sf + r.f,
              }, transaction,
            });
          }
        });
        console.log(`Insertadas ${demo.length} filas de prueba para ${cutDate}.`);
      }
    }
  } catch (error) {
    console.error('No se pudieron insertar los datos:', error.message);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}
