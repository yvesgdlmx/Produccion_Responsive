import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { validDate } from '../services/wipProjectionEngine.js';

dotenv.config({ path: '.env' });

const columns = [
  'fecha', 'nvi_en_proceso', 'nvi_fs', 'nvi_total_term', 'nvi_total_ster',
  'no_surtido_term', 'no_surtido_ster', 'surtido_term', 'surtido_ster',
  'nvi_con_ar', 'nvi_ar_term', 'nvi_ar_semi', 'nvi_sin_ar', 'nvi_sin_ar_term',
  'nvi_sin_ar_semi', 'no_surtido_ar_semi', 'no_surtido_sin_ar_semi',
  'fecha_insercion', 'hora_insercion',
];
const date = process.argv[process.argv.indexOf('--date') + 1];
const file = process.argv[process.argv.indexOf('--file') + 1];
const apply = process.argv.includes('--apply');

function readCut() {
  if (!validDate(date) || !file || file.startsWith('--')) {
    throw new Error('Uso: node scripts/importWipCutCsv.js --date AAAA-MM-DD --file ruta.csv [--apply]');
  }
  const contents = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').trim();
  const [header, ...lines] = contents.split(/\r?\n/);
  if (header !== columns.join(',')) throw new Error('Las columnas no coinciden con resumen_nvis.');
  if (!lines.length) throw new Error('El CSV no contiene registros.');
  const seen = new Set();
  const rows = lines.map((line, index) => {
    const values = line.split(',');
    if (values.length !== columns.length) throw new Error(`Fila ${index + 2}: numero de columnas incorrecto.`);
    const row = Object.fromEntries(columns.map((name, i) => [name, values[i].trim()]));
    if (!validDate(row.fecha) || row.fecha >= date || row.fecha_insercion !== date || row.hora_insercion !== '00:00:00') {
      throw new Error(`Fila ${index + 2}: fecha de origen, corte u hora invalidos.`);
    }
    if (seen.has(row.fecha)) throw new Error(`Fecha de origen duplicada: ${row.fecha}`);
    seen.add(row.fecha);
    for (const name of columns.slice(1, -2)) {
      if (!/^\d+$/.test(row[name]) || !Number.isSafeInteger(Number(row[name]))) {
        throw new Error(`Fila ${index + 2}: ${name} debe ser un entero no negativo.`);
      }
      row[name] = Number(row[name]);
    }
    if (row.nvi_en_proceso !== row.nvi_ar_semi + row.nvi_sin_ar_semi + row.nvi_total_term) {
      throw new Error(`Fila ${index + 2}: WIP distinto de SF AR + SF + F.`);
    }
    return row;
  });
  return { rows, sha256: createHash('sha256').update(contents).digest('hex') };
}

function assertMatches(actual, expected) {
  if (actual.length !== expected.length) throw new Error('La cantidad de filas no coincide tras la insercion.');
  for (let i = 0; i < expected.length; i++) {
    for (const name of columns) {
      const value = name === 'fecha' || name === 'fecha_insercion'
        ? String(actual[i][name]).slice(0, 10) : actual[i][name];
      if (String(value) !== String(expected[i][name])) {
        throw new Error(`Diferencia en ${name} de la fila ${i + 1}.`);
      }
    }
  }
}

async function main() {
  if (!/^(localhost|127[.]0[.]0[.]1|::1)$/i.test(process.env.BD_HOST || '')) {
    throw new Error('Solo se permite importar en una base local.');
  }
  const { rows, sha256 } = readCut();
  const totals = rows.reduce((sum, row) => ({
    wip: sum.wip + row.nvi_en_proceso,
    sfAr: sum.sfAr + row.nvi_ar_semi,
    sf: sum.sf + row.nvi_sin_ar_semi,
    f: sum.f + row.nvi_total_term,
  }), { wip: 0, sfAr: 0, sf: 0, f: 0 });
  const db = await mysql.createConnection({
    host: process.env.BD_HOST, port: process.env.DB_PORT || 3306,
    user: process.env.BD_USER, password: process.env.BD_PASS || '',
    database: process.env.BD_NOMBRE, dateStrings: true, connectTimeout: 5000,
  });
  try {
    const readSql = `SELECT ${columns.map((name) =>
      name === 'fecha' || name === 'fecha_insercion' ? `DATE_FORMAT(${name}, '%Y-%m-%d') AS ${name}` : name
    ).join(', ')} FROM resumen_nvis WHERE fecha_insercion >= ? AND fecha_insercion < DATE_ADD(?, INTERVAL 1 DAY) ORDER BY fecha, id`;
    const expected = [...rows].sort((a, b) => a.fecha.localeCompare(b.fecha));
    const [existing] = await db.execute(readSql, [date, date]);
    let state = 'listo para insertar';
    if (existing.length) {
      assertMatches(existing, expected);
      state = 'ya insertado; coincide exactamente';
    }
    console.log(JSON.stringify({ date, sha256, rows: rows.length, totals, state }, null, 2));
    if (!apply || existing.length) return;
    await db.beginTransaction();
    try {
      const [again] = await db.execute(readSql, [date, date]);
      if (again.length) throw new Error('El corte aparecio durante la importacion; no se duplico.');
      const sql = `INSERT INTO resumen_nvis (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
      for (const row of rows) await db.execute(sql, columns.map((name) => row[name]));
      const [verified] = await db.execute(readSql, [date, date]);
      assertMatches(verified, expected);
      await db.commit();
      console.log('Corte insertado y verificado campo por campo.');
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } finally {
    await db.end();
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
