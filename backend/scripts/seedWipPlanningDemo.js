import moment from 'moment-timezone';
import db from '../config/db.js';
import Usuario from '../models/Usuario.js';
import WipPlanDia from '../models/WipPlanDia.js';
import { DEFAULT_PERCENTAGES, datePlus, validDate } from '../services/wipProjectionEngine.js';
import { latestCut } from '../services/wipProjectionService.js';

const args = process.argv.slice(2);
const dateIndex = args.indexOf('--date');
const daysIndex = args.indexOf('--days');
const requestedDate = dateIndex < 0 ? null : args[dateIndex + 1];
const days = daysIndex < 0 ? 33 : Number(args[daysIndex + 1]);
const apply = args.includes('--apply');

try {
  if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) {
    throw new Error('El script solo acepta una base local.');
  }
  if (requestedDate && !validDate(requestedDate)) throw new Error('Fecha invalida. Usa --date YYYY-MM-DD.');
  if (!Number.isSafeInteger(days) || days < 1 || days > 366) throw new Error('--days debe estar entre 1 y 366.');

  await db.authenticate();
  const cut = await latestCut();
  if (!cut) throw new Error('No hay un corte real de las 00:00 para iniciar la planeacion.');
  const firstDate = requestedDate || cut.fecha;
  if (firstDate < cut.fecha) throw new Error('La planeacion de prueba debe empezar en el ultimo corte o despues.');
  const currentYear = moment.tz('America/Mexico_City').year();
  if (Number(firstDate.slice(0, 4)) !== currentYear || Number(datePlus(firstDate, days - 1).slice(0, 4)) !== currentYear) {
    throw new Error('El rango debe permanecer en el anio actual.');
  }

  const admin = await Usuario.findOne({ where: { rol: 'admin' }, attributes: ['id'] });
  if (!admin) throw new Error('No se encontro un usuario admin para la autoria de la planeacion.');
  const dates = Array.from({ length: days }, (_, i) => datePlus(firstDate, i));
  const existing = await WipPlanDia.findAll({ where: { fecha: dates }, attributes: ['fecha'], raw: true });
  const occupied = new Set(existing.map((row) => row.fecha));
  const pending = dates.filter((fecha) => !occupied.has(fecha)).map((fecha) => {
    const sunday = moment.utc(fecha).day() === 0;
    return {
      fecha,
      llegada: 8046,
      metaSfAr: sunday ? 0 : 1924,
      metaSf: sunday ? 0 : 2883,
      metaF: sunday ? 0 : 4193,
      pctSfAr: DEFAULT_PERCENTAGES.sfAr,
      pctSf: DEFAULT_PERCENTAGES.sf,
      pctF: DEFAULT_PERCENTAGES.f,
      usuarioId: admin.id,
    };
  });

  console.log(`Planeacion de demostracion: ${dates[0]} a ${dates.at(-1)}.`);
  console.log(`Entradas diarias: 8,046; metas lunes-sabado: SF AR 1,924, SF 2,883, F 4,193; domingo: 0.`);
  console.log(`Dias ya capturados: ${occupied.size}; dias por insertar: ${pending.length}.`);
  if (!apply) console.log('Vista previa. Agrega --apply para insertar.');
  else if (pending.length) {
    await db.transaction((transaction) => WipPlanDia.bulkCreate(pending, { transaction, ignoreDuplicates: true }));
    console.log(`Insertados ${pending.length} dias sin modificar valores existentes.`);
  }
} catch (error) {
  console.error('No se pudo cargar la planeacion de prueba:', error.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
