from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from zipfile import ZipFile
import os
import re

source = Path(r'C:\Users\Desarrollo\Downloads\plantilla-planeacion-wip-2026 (3).xlsx')
output = Path(r'C:\Users\Desarrollo\Desktop\optimex_production\outputs\wip-plan-2026\planeacion-wip-2026-metas-enteras.xlsx')
temporary = output.with_suffix('.tmp.xlsx')
pattern = re.compile(rb'(<c\b[^>]*\br="([CDE])(\d+)"[^>]*>\s*<v>)([^<]+)(</v>)')
changed = []

def fix_cell(match):
    column = match.group(2).decode()
    row = int(match.group(3))
    value = Decimal(match.group(4).decode())
    if row < 2 or value == value.to_integral_value():
        return match.group(0)
    rounded = value.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
    changed.append((f'{column}{row}', str(value), str(rounded)))
    return match.group(1) + str(rounded).encode() + match.group(5)

with ZipFile(source) as original, ZipFile(temporary, 'w') as corrected:
    for item in original.infolist():
        data = original.read(item.filename)
        if item.filename == 'xl/worksheets/sheet1.xml':
            data = pattern.sub(fix_cell, data)
        corrected.writestr(item, data)

if len(changed) != 438:
    temporary.unlink(missing_ok=True)
    raise RuntimeError(f'Se esperaban 438 cambios y se encontraron {len(changed)}')
os.replace(temporary, output)
print(f'Celdas corregidas: {len(changed)}; primera: {changed[0]}; última: {changed[-1]}')
