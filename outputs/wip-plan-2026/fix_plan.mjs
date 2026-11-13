import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Desarrollo/Downloads/plantilla-planeacion-wip-2026 (3).xlsx';
const outputDir = 'C:/Users/Desarrollo/Desktop/optimex_production/outputs/wip-plan-2026';
const outputPath = `${outputDir}/planeacion-wip-2026-metas-enteras.xlsx`;

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem('Planeacion');
const before = await workbook.render({ sheetName: 'Planeacion', range: 'A108:H114', scale: 1.5, format: 'png' });
await fs.writeFile(`${outputDir}/before.png`, new Uint8Array(await before.arrayBuffer()));

let changed = 0;
const byColumn = { C: 0, D: 0, E: 0 };
for (let row = 2; row <= 366; row++) {
  for (const column of ['C', 'D', 'E']) {
    const cell = sheet.getRange(`${column}${row}`);
    const value = cell.values[0][0];
    if (typeof value === 'number' && !Number.isInteger(value)) {
      cell.values = [[Math.round(value)]];
      changed++;
      byColumn[column]++;
    }
  }
}
if (changed !== 438) throw new Error(`Se esperaban 438 celdas; encontradas ${changed}.`);
workbook.recalculate();
const after = await workbook.render({ sheetName: 'Planeacion', range: 'A108:H114', scale: 1.5, format: 'png' });
await fs.writeFile(`${outputDir}/after.png`, new Uint8Array(await after.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, changed, byColumn }));
