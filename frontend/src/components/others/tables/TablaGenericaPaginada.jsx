import React, { useState } from 'react';
import Paginador from '../Paginador';
const TablaGenericaPaginada = ({ columns, data, itemsPerPage = 10 }) => {
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);
  // Calcular el total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // Calcular el índice del primer y último elemento de la página
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Seleccionar los datos que se muestran en la página actual
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  // Función para cambiar de página
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border rounded-lg shadow-md text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="py-3 px-5 text-left font-semibold border-l first:border-l-0"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr
              key={index}
              className={`border-t border-gray-200 hover:bg-blue-100 ${
                index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="py-3 px-5 border text-gray-500">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center bg-white p-4 rounded-md">
          <Paginador currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
        </div>
      )}
    </div>
  );
};
export default TablaGenericaPaginada;