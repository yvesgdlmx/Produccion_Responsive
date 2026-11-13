import { Op } from 'sequelize';
import db from '../config/db.js';
import WipPlanDia from '../models/WipPlanDia.js';
import WipProyeccionVersion from '../models/WipProyeccionVersion.js';
import { DEFAULT_PERCENTAGES, validDate, validatePlan } from '../services/wipProjectionEngine.js';
import { calculateCurrent, calculateMonth, compareVersion, storeVersion, today, planFields, contentHash } from '../services/wipProjectionService.js';

const versionFields = ['id', 'fechaBase', 'tipo', 'nota', 'usuarioId', 'createdAt'];
const sendError = (res, error) => {
  console.error('Proyeccion WIP:', error);
  return res.status(error.status || 500).json({ msg: error.status ? error.message : 'No se pudo procesar la proyeccion WIP' });
};
const badRequest = (message) => Object.assign(new Error(message), { status: 400 });

function planningRows(year, inputRows, usuarioId) {
  if (year !== Number(today().slice(0, 4))) throw badRequest('Solo se puede editar la planeacion del anio actual');
  if (!Array.isArray(inputRows) || !inputRows.length || inputRows.length > 366) throw badRequest('Envia entre 1 y 366 dias');
  const dates = new Set();
  return inputRows.map((raw, index) => {
    if (!raw || typeof raw !== 'object') throw badRequest(`Fila ${index + 2}: registro invalido`);
    const input = Object.fromEntries(planFields.map((key) => [key, raw[key]]));
    let row;
    try { row = validatePlan(input); } catch (error) { throw badRequest(`Fila ${index + 2}: ${error.message}`); }
    if (!row.fecha.startsWith(`${year}-`) || dates.has(row.fecha)) throw badRequest(`Fila ${index + 2}: fecha duplicada o fuera del anio`);
    dates.add(row.fecha);
    return { ...row, usuarioId };
  });
}

export async function getPlanning(req, res) {
  try {
    const year = Number(req.params.year);
    if (!Number.isInteger(year) || year < 2020 || year > 2100) throw badRequest('Anio invalido');
    const rows = await WipPlanDia.findAll({ where: { fecha: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } }, order: [['fecha', 'ASC']], raw: true });
    res.json({ year, rows, defaults: DEFAULT_PERCENTAGES, currentYear: Number(today().slice(0, 4)) });
  } catch (error) { sendError(res, error); }
}

export async function savePlanning(req, res) {
  try {
    const year = Number(req.params.year);
    const rows = planningRows(year, req.body.rows, req.usuario.id);
    await db.transaction(async (transaction) => {
      await WipPlanDia.bulkCreate(rows, { transaction, updateOnDuplicate: [...planFields.filter((f) => f !== 'fecha'), 'usuarioId', 'updatedAt'] });
    });
    res.json({ msg: 'Planeacion guardada', count: rows.length });
  } catch (error) { sendError(res, error); }
}

export async function previewPlanning(req, res) {
  try {
    const year = Number(req.params.year);
    const rows = planningRows(year, req.body.rows, req.usuario.id);
    const existing = await WipPlanDia.findAll({
      attributes: planFields,
      where: { fecha: { [Op.in]: rows.map((row) => row.fecha) } }, raw: true,
    });
    const byDate = new Map(existing.map((row) => [row.fecha, row]));
    const preview = rows.map((row) => {
      const current = byDate.get(row.fecha);
      const status = !current ? 'nuevo' : planFields.some((key) => key !== 'fecha' && Number(current[key]) !== Number(row[key])) ? 'actualizar' : 'sin cambios';
      return { ...Object.fromEntries(planFields.map((key) => [key, row[key]])), status };
    });
    res.json({ rows: preview, counts: {
      nuevo: preview.filter((row) => row.status === 'nuevo').length,
      actualizar: preview.filter((row) => row.status === 'actualizar').length,
      sinCambios: preview.filter((row) => row.status === 'sin cambios').length,
    } });
  } catch (error) { sendError(res, error); }
}

export async function getCurrent(req, res) {
  try {
    const { fecha } = req.query;
    if (fecha && (!validDate(fecha) || fecha > today())) throw badRequest('Fecha de corte invalida');
    const content = await calculateCurrent(fecha);
    if (!content) return res.json({ projection: null, msg: 'No hay un corte real de las 00:00 para esta fecha' });
    if (content.blocks.length > 1) await storeVersion(content);
    res.json({ projection: content, hash: contentHash(content) });
  } catch (error) { sendError(res, error); }
}

export async function getMonth(req, res) {
  try {
    const { mes } = req.query;
    if (typeof mes !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) || mes < '2020-01' || mes > `${today().slice(0, 4)}-12`) {
      throw badRequest('Mes invalido');
    }
    res.json({ view: await calculateMonth(mes) });
  } catch (error) { sendError(res, error); }
}

export async function saveCurrent(req, res) {
  try {
    const { fecha, hash, nota } = req.body;
    if (!validDate(fecha) || fecha > today()) throw badRequest('Fecha de corte invalida');
    if (nota !== undefined && (typeof nota !== 'string' || nota.length > 200)) throw badRequest('La nota admite hasta 200 caracteres');
    const content = await calculateCurrent(fecha);
    if (!content || content.blocks.length < 2) throw badRequest('Falta el corte real o la planeacion del dia base');
    if (hash !== contentHash(content)) return res.status(409).json({ msg: 'Los datos cambiaron. Actualiza la proyeccion antes de guardarla.' });
    const version = await storeVersion(content, { manual: true, nota: nota?.trim() || null, usuarioId: req.usuario.id });
    res.status(201).json({ id: version.id, msg: 'Version guardada en historial' });
  } catch (error) { sendError(res, error); }
}

export async function getHistory(req, res) {
  try {
    const page = Number(req.query.page || 1);
    if (!Number.isInteger(page) || page < 1 || page > 100000) throw badRequest('Pagina invalida');
    const where = {};
    if (req.query.year) {
      const year = Number(req.query.year);
      if (!Number.isInteger(year) || year < 2020 || year > 2100) throw badRequest('Anio invalido');
      where.fechaBase = { [Op.between]: [`${year}-01-01`, `${year}-12-31`] };
    }
    const { rows, count } = await WipProyeccionVersion.findAndCountAll({ attributes: versionFields, where, order: [['id', 'DESC']], limit: 20, offset: (page - 1) * 20 });
    res.json({ rows, count, page });
  } catch (error) { sendError(res, error); }
}

export async function getVersion(req, res) {
  try {
    if (!/^\d+$/.test(req.params.id)) throw badRequest('Version invalida');
    const row = await WipProyeccionVersion.findByPk(req.params.id);
    if (!row) return res.status(404).json({ msg: 'Version no encontrada' });
    const content = typeof row.contenido === 'string' ? JSON.parse(row.contenido) : row.contenido;
    const metadata = Object.fromEntries(versionFields.map((key) => [key, row[key]]));
    res.json({ version: metadata, projection: content, comparison: await compareVersion(content) });
  } catch (error) { sendError(res, error); }
}
