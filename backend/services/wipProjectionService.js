import { createHash, randomUUID } from 'node:crypto';
import { Op, QueryTypes } from 'sequelize';
import moment from 'moment-timezone';
import db from '../config/db.js';
import ReportesResumenComp from '../models/ReportesResumenComp.js';
import WipPlanDia from '../models/WipPlanDia.js';
import WipProyeccionVersion from '../models/WipProyeccionVersion.js';
import { ZONE, datePlus, project, toBuckets, makeBlock } from './wipProjectionEngine.js';

const sourceTable = db.getQueryInterface().queryGenerator.quoteTable(ReportesResumenComp.getTableName());
export const today = () => moment.tz(ZONE).format('YYYY-MM-DD');
export const planFields = ['fecha', 'llegada', 'metaSfAr', 'metaSf', 'metaF', 'pctSfAr', 'pctSf', 'pctF'];

// Format dates in MySQL so DATE columns and DATETIME columns keep their calendar date.
export async function readCuts(from, to) {
  const rows = await db.query(`SELECT id,
    DATE_FORMAT(fecha_insercion, '%Y-%m-%d') AS corte,
    DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
    nvi_ar_semi AS sfAr, nvi_sin_ar_semi AS sf, nvi_total_term AS f,
    nvi_en_proceso AS sourceWip
    FROM ${sourceTable}
    WHERE fecha_insercion >= :from AND fecha_insercion < :end
      AND hora_insercion = '00:00:00'
    ORDER BY fecha_insercion, fecha, id`, {
    replacements: { from, end: datePlus(to, 1) }, type: QueryTypes.SELECT,
  });
  const cuts = new Map();
  for (const row of rows) {
    if (!cuts.has(row.corte)) cuts.set(row.corte, { fecha: row.corte, sourceWip: 0, records: [] });
    const cut = cuts.get(row.corte);
    cut.sourceWip += Number(row.sourceWip || 0);
    cut.records.push({ fecha: row.fecha, sfAr: Number(row.sfAr || 0), sf: Number(row.sf || 0), f: Number(row.f || 0) });
  }
  return cuts;
}

export async function latestCut() {
  const rows = await db.query(`SELECT DATE_FORMAT(fecha_insercion, '%Y-%m-%d') AS fecha
    FROM ${sourceTable} WHERE hora_insercion = '00:00:00' AND fecha_insercion < :end
    ORDER BY fecha_insercion DESC LIMIT 1`, { replacements: { end: datePlus(today(), 1) }, type: QueryTypes.SELECT });
  if (!rows.length) return null;
  return (await readCuts(rows[0].fecha, rows[0].fecha)).get(rows[0].fecha);
}

export async function calculateCurrent(fecha) {
  const cut = fecha ? (await readCuts(fecha, fecha)).get(fecha) : await latestCut();
  if (!cut) return null;
  const plans = await WipPlanDia.findAll({
    attributes: planFields, where: { fecha: { [Op.between]: [cut.fecha, datePlus(cut.fecha, 30)] } }, order: [['fecha', 'ASC']], raw: true,
  });
  return project(cut, plans, 30);
}

export async function calculateMonth(month) {
  const start = `${month}-01`;
  const end = moment.utc(start, 'YYYY-MM-DD', true).endOf('month').format('YYYY-MM-DD');
  const realEnd = end < today() ? end : today();
  const cuts = start <= realEnd ? await readCuts(start, realEnd) : new Map();
  const latest = await latestCut();
  const planStart = latest && latest.fecha < start ? latest.fecha : start;
  const plans = await WipPlanDia.findAll({
    attributes: planFields, where: { fecha: { [Op.between]: [planStart, end] } }, order: [['fecha', 'ASC']], raw: true,
  });
  const byPlan = new Map(plans.map((row) => [row.fecha, row]));
  let forecast = null;
  if (latest && latest.fecha <= end) {
    const days = moment.utc(end).diff(moment.utc(latest.fecha), 'days');
    forecast = project(latest, plans.filter((row) => row.fecha >= latest.fecha), days);
  }

  const actual = [...cuts.values()].map((cut) => {
    if (cut.fecha === latest?.fecha && forecast) return forecast.blocks[0];
    const plan = byPlan.get(cut.fecha);
    const block = makeBlock(cut.fecha, toBuckets(cut.records), plan, true);
    if (plan) block.movement = { plannedArrival: Number(plan.llegada) };
    return block;
  });
  const projected = (forecast?.blocks || []).filter((block) =>
    !block.real && block.fecha >= start && block.fecha <= end && !cuts.has(block.fecha));
  const blocks = [...actual, ...projected].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const missingDate = forecast?.missingDate && forecast.missingDate <= end ? forecast.missingDate : null;
  return {
    month, cut: latest, blocks, contextBlocks: forecast?.blocks || [], missingDate,
  };
}

export async function storeVersion(content, { manual = false, nota = null, usuarioId = null } = {}) {
  // One automatic version per real cut; explicit saves preserve later planning changes.
  const clave = manual ? `manual:${randomUUID()}` : `auto:${content.cut.fecha}`;
  const defaults = { clave, fechaBase: content.cut.fecha, tipo: manual ? 'manual' : 'automatica', nota, usuarioId, contenido: content };
  if (manual) return WipProyeccionVersion.create(defaults);
  const [version] = await WipProyeccionVersion.findOrCreate({ where: { clave }, defaults });
  return version;
}

export function contentHash(content) {
  const { calculatedAt, ...stable } = content;
  return createHash('sha256').update(JSON.stringify(stable)).digest('hex');
}

export async function compareVersion(content) {
  const last = content.blocks[content.blocks.length - 1].fecha;
  const cuts = await readCuts(content.cut.fecha, last < today() ? last : today());
  return content.blocks.filter((b) => !b.real).map((b) => {
    const cut = cuts.get(b.fecha);
    const real = cut ? makeBlock(b.fecha, toBuckets(cut.records), null, true) : null;
    return { fecha: b.fecha, proyectado: b.total, real: real?.total ?? null,
      diferencia: real ? real.total - b.total : null,
      categorias: { proyectado: b.totals, real: real?.totals ?? null } };
  });
}

export function startWipProjectionMonitor() {
  let busy = false;
  const tick = async () => {
    if (busy) return;
    busy = true;
    try {
      const cut = await latestCut();
      if (cut && !(await WipProyeccionVersion.findOne({ where: { clave: `auto:${cut.fecha}` }, attributes: ['id'] }))) {
        const content = await calculateCurrent(cut.fecha);
        // Wait for at least the base day's plan before freezing the first forecast.
        if (content.blocks.length > 1) await storeVersion(content);
      }
    } catch (error) {
      console.error('Monitor de proyeccion WIP:', error.message);
    } finally { busy = false; }
  };
  const timer = setInterval(tick, 5 * 60 * 1000);
  const first = setTimeout(tick, 10000);
  timer.unref();
  first.unref();
  return () => { clearInterval(timer); clearTimeout(first); };
}
