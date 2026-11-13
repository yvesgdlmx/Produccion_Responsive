import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { project, validDate } from '../services/wipProjectionEngine.js';

dotenv.config({ path: '.env' });

const columns = [
  'fecha', 'nvi_en_proceso', 'nvi_fs', 'nvi_total_term', 'nvi_total_ster',
  'no_surtido_term', 'no_surtido_ster', 'surtido_term', 'surtido_ster',
  'nvi_con_ar', 'nvi_ar_term', 'nvi_ar_semi', 'nvi_sin_ar', 'nvi_sin_ar_term',
  'nvi_sin_ar_semi', 'no_surtido_ar_semi', 'no_surtido_sin_ar_semi',
  'fecha_insercion', 'hora_insercion',
];
const realDays = ['01', '03', '04', '05', '06', '07', '08', '09'].map((day) => `2026-11-${day}`);
const expectedLocalWip = {
  '2026-11-01': 23539, '2026-11-02': 31239, '2026-11-03': 30949,
  '2026-11-04': 30069, '2026-11-05': 28871, '2026-11-06': 28554,
  '2026-11-07': 28340, '2026-11-08': 27337, '2026-11-09': 36122,
};
const expectedLocalCounts = [6, 7, 7, 7, 7, 7, 7, 6, 7];
const fileIndex = process.argv.indexOf('--file');
const sourcePath = fileIndex < 0 ? null : process.argv[fileIndex + 1];
const apply = process.argv.includes('--apply');

function readSource(path) {
  if (!path || path.startsWith('--')) throw new Error('Uso: node scripts/importWipNovemberCuts.js --file ruta.csv [--apply]');
  const contents = readFileSync(path, 'utf8').replace(/^\uFEFF/, '').trim();
  const [header, ...lines] = contents.split(/\r?\n/);
  if (header !== columns.join(',')) throw new Error('Las columnas del CSV no coinciden con resumen_nvis.');
  const seen = new Set();
  const rows = lines.map((line, index) => {
    const values = line.split(',');
    if (values.length !== columns.length) throw new Error(`Fila ${index + 2}: formato CSV inesperado.`);
    const row = Object.fromEntries(columns.map((name, i) => [name, values[i].trim()]));
    if (!realDays.includes(row.fecha_insercion) || row.hora_insercion !== '00:00:00' ||
        !validDate(row.fecha) || row.fecha >= row.fecha_insercion) {
      throw new Error(`Fila ${index + 2}: corte, hora o fecha de origen invalidos.`);
    }
    const key = `${row.fecha_insercion}/${row.fecha}`;
    if (seen.has(key)) throw new Error(`Fecha de origen duplicada: ${key}`);
    seen.add(key);
    for (const name of columns.slice(1, -2)) {
      if (!/^\d+$/.test(row[name]) || !Number.isSafeInteger(Number(row[name]))) {
        throw new Error(`Fila ${index + 2}: ${name} debe ser un entero no negativo.`);
      }
      row[name] = Number(row[name]);
    }
    if (row.nvi_en_proceso !== row.nvi_ar_semi + row.nvi_sin_ar_semi + row.nvi_total_term) {
      throw new Error(`Fila ${index + 2}: el WIP no coincide con SF AR + SF + F.`);
    }
    return row;
  });
  if (rows.length !== 50 || realDays.some((day) => !rows.some((row) => row.fecha_insercion === day))) {
    throw new Error('El CSV debe contener los 50 registros reales de los dias 1 y 3 al 9.');
  }
  return { rows, sha256: createHash('sha256').update(contents).digest('hex') };
}

function syntheticSecond(realRows, plan) {
  const first = realRows.filter((row) => row.fecha_insercion === '2026-11-01');
  const cut = {
    fecha: '2026-11-01',
    sourceWip: first.reduce((sum, row) => sum + row.nvi_en_proceso, 0),
    records: first.map((row) => ({
      fecha: row.fecha, sfAr: row.nvi_ar_semi,
      sf: row.nvi_sin_ar_semi, f: row.nvi_total_term,
    })),
  };
  const block = project(cut, [plan], 1).blocks[1];
  return block.columns.map(({ fecha, sfAr, sf, f }) => ({
    fecha, nvi_en_proceso: sfAr + sf + f, nvi_fs: 0,
    nvi_total_term: f, nvi_total_ster: sfAr + sf,
    no_surtido_term: 0, no_surtido_ster: 0,
    surtido_term: f, surtido_ster: sfAr + sf,
    nvi_con_ar: sfAr, nvi_ar_term: 0, nvi_ar_semi: sfAr,
    nvi_sin_ar: sf + f, nvi_sin_ar_term: f, nvi_sin_ar_semi: sf,
    no_surtido_ar_semi: 0, no_surtido_sin_ar_semi: 0,
    fecha_insercion: '2026-11-02', hora_insercion: '00:00:00',
  }));
}

async function main() {
  if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) {
    throw new Error('Solo se permite importar en una base local.');
  }
  const { rows: realRows, sha256 } = readSource(sourcePath);
  const db = await mysql.createConnection({
    host: process.env.BD_HOST, port: process.env.DB_PORT || 3306,
    user: process.env.BD_USER, password: process.env.BD_PASS || '',
    database: process.env.BD_NOMBRE, dateStrings: true, connectTimeout: 5000,
  });
  try {
    const [plans] = await db.execute(
      'SELECT fecha, llegada, metaSfAr, metaSf, metaF, pctSfAr, pctSf, pctF FROM wip_plan_dias WHERE fecha = ?',
      ['2026-11-01'],
    );
    if (plans.length !== 1) throw new Error('Falta la planeacion del 1 de noviembre.');
    const syntheticRows = syntheticSecond(realRows, plans[0]);
    const allRows = [...realRows, ...syntheticRows];
    const [existing] = await db.execute(
      "SELECT * FROM resumen_nvis WHERE fecha_insercion >= '2026-11-01' AND fecha_insercion < '2026-11-10' ORDER BY fecha_insercion, fecha, id",
    );
    const currentTotals = Object.fromEntries(Object.keys(expectedLocalWip).map((day) => [day, 0]));
    const currentCounts = Object.fromEntries(Object.keys(expectedLocalWip).map((day) => [day, 0]));
    for (const row of existing) {
      const day = row.fecha_insercion.slice(0, 10);
      if (row.hora_insercion !== '00:00:00' || !(day in currentTotals)) {
        throw new Error('Hay registros locales inesperados. No se reemplazo nada.');
      }
      currentTotals[day] += Number(row.nvi_en_proceso);
      currentCounts[day] += 1;
    }
    if (Object.entries(expectedLocalWip).some(([day, total], index) =>
      currentTotals[day] !== total || currentCounts[day] !== expectedLocalCounts[index])) {
      throw new Error('Los cortes locales cambiaron desde la revision. No se reemplazo nada.');
    }
    const summary = Object.keys(expectedLocalWip).map((day) => {
      const dayRows = allRows.filter((row) => row.fecha_insercion === day);
      return { day, rows: dayRows.length, wip: dayRows.reduce((sum, row) => sum + row.nvi_en_proceso, 0), origin: day === '2026-11-02' ? 'sintetico' : 'real' };
    });
    console.log(JSON.stringify({ sha256, sourceRows: realRows.length, syntheticRows: syntheticRows.length, summary }, null, 2));
    if (!apply) { console.log('Vista previa. Agrega --apply para reemplazar los cortes locales.'); return; }

    const backupDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'backups');
    mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(backupDir, `wip-before-import-${stamp}.json`);
    writeFileSync(backupPath, JSON.stringify({ sourceSha256: sha256, syntheticDate: '2026-11-02', plan: plans[0], rows: existing }, null, 2));
    console.log(`Respaldo local: ${backupPath}`);

    await db.beginTransaction();
    try {
      await db.execute("DELETE FROM resumen_nvis WHERE fecha_insercion >= '2026-11-01' AND fecha_insercion < '2026-11-10'");
      const sql = `INSERT INTO resumen_nvis (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
      for (const row of allRows) await db.execute(sql, columns.map((name) => row[name]));
      const [verified] = await db.execute(
        "SELECT DATE_FORMAT(fecha_insercion, '%Y-%m-%d') AS day, COUNT(*) AS filas, SUM(nvi_en_proceso) AS wip, SUM(nvi_ar_semi + nvi_sin_ar_semi + nvi_total_term) AS components FROM resumen_nvis WHERE fecha_insercion >= '2026-11-01' AND fecha_insercion < '2026-11-10' AND hora_insercion = '00:00:00' GROUP BY DATE_FORMAT(fecha_insercion, '%Y-%m-%d') ORDER BY day",
      );
      if (verified.length !== summary.length || verified.some((row, index) =>
        row.day !== summary[index].day || Number(row.filas) !== summary[index].rows ||
        Number(row.wip) !== summary[index].wip || Number(row.components) !== summary[index].wip)) {
        throw new Error('Fallo la comprobacion posterior a la insercion.');
      }
      await db.commit();
      console.log('Importacion completada y verificada.');
    } catch (error) { await db.rollback(); throw error; }
  } finally { await db.end(); }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
