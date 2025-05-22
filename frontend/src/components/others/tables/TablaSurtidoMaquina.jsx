import React from 'react';
const TablaSurtidoMaquina = ({ columns, finalFilteredData, totalsRow }) => {
  return (
    // Contenedor que permite el overflow horizontal
    <div className="overflow-x-auto">
      {/* Contenedor que aplica la sombra y se ajusta al contenido */}
      <div className="shadow-md w-max">
        <table className="table-fixed divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              {columns.map(col => (
                <th
                  key={col.accessor}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-semibold">
            {finalFilteredData.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors duration-200 hover:bg-blue-100 ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}
              >
                {columns.map(col => {
                  let cellValue = row[col.accessor] !== undefined ? row[col.accessor] : '-';
                  let cellClass = "px-6 py-4 text-sm ";
                  // Para columnas de registros por hora: se compara con "metaPorHora"
                  if (col.accessor.startsWith("hour_")) {
                    const valor = Number(row[col.accessor] || 0);
                    const meta = Number(row.metaPorHora || 0);
                    if (!isNaN(valor) && !isNaN(meta)) {
                      cellClass += valor >= meta ? "text-green-700" : "text-red-700";
                    }
                  }
                  // Para la columna "totalAcumulado": se compara con "metaAcumulada"
                  else if (col.accessor === "totalAcumulado") {
                    const valor = Number(row.totalAcumulado || 0);
                    const meta = Number(row.metaAcumulada || 0);
                    if (!isNaN(valor) && !isNaN(meta)) {
                      cellClass += valor >= meta ? "text-green-700" : "text-red-700";
                    }
                  }
                  return (
                    <td key={col.accessor} className={cellClass}>
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Fila de totales con border-bottom agregado en cada celda */}
            <tr className="bg-blue-50 font-semibold">
              {columns.map(col => {
                let cellValue = totalsRow[col.accessor] !== undefined ? totalsRow[col.accessor] : '-';
                // Se agrega border-b y un color de borde (por ejemplo border-gray-300)
                let cellClass = "px-6 py-4 text-sm border-b border-gray-200 ";
                if (col.accessor.startsWith("hour_")) {
                  const valor = Number(totalsRow[col.accessor] || 0);
                  const meta = Number(totalsRow.metaPorHora || 0);
                  if (!isNaN(valor) && !isNaN(meta)) {
                    cellClass += valor >= meta ? "text-green-700" : "text-red-700";
                  }
                }
                else if (col.accessor === "totalAcumulado") {
                  const valor = Number(totalsRow.totalAcumulado || 0);
                  const meta = Number(totalsRow.metaAcumulada || 0);
                  if (!isNaN(valor) && !isNaN(meta)) {
                    cellClass += valor >= meta ? "text-green-700" : "text-red-700";
                  }
                }
                return (
                  <td key={col.accessor} className={cellClass}>
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TablaSurtidoMaquina;