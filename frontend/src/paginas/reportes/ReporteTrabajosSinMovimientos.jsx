import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import clienteAxios from '../../../config/clienteAxios';
import Heading from '../../components/others/Heading';
const ReporteTrabajosSinMovimientos = () => {
  // Estados para la data, paginación, filtros y actualización
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Estados de filtrado: campo a filtrar y valor a buscar
  const [filterField, setFilterField] = useState('enterDate');
  const [filterValue, setFilterValue] = useState('');
  // Estado para la última actualización
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');
  // Configuración de registros por página (ajústalo según necesites)
  const itemsPerPage = 10;
  // Efecto para actualizar la hora y recargar al minuto 35 (similar al otro componente)
  useEffect(() => {
    const actualizarHora = () => {
      const ahora = new Date();
      // Establece el minuto 35 (para mostrarla en el div de actualización)
      ahora.setMinutes(35, 0, 0);
      const horaFormateada = ahora.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setUltimaActualizacion(horaFormateada);
    };
    const verificarYActualizar = () => {
      const ahora = new Date();
      if (ahora.getMinutes() === 35) {
        actualizarHora();
        window.location.reload();
      }
    };
    actualizarHora(); // Actualiza inmediatamente al cargar
    const intervalo = setInterval(verificarYActualizar, 60000);
    return () => clearInterval(intervalo);
  }, []);
  // Efecto para obtener los datos desde el endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get('/reportes/reportes/movimientos');
        // Mapeamos cada registro transformando las claves a camelCase
        const registros = response.data.registros.map((registro) => ({
          id: registro.id,
          enterDate: registro.enter_date,
          trayNumber: registro.tray_number,
          currentStation: registro.current_station,
          division: registro.division,
          daysInProcess: registro.days_in_process,
          currentStnDate: registro.current_stn_date,
          currentStnTime: registro.current_stn_time,
          fs: registro.f_s,
          diaActual: registro.dia_actual,
          horaActual: registro.hora_actual,
          transcurrido: registro.transcurrido,
          diaYHora: `${moment(registro.dia_actual).format('DD/MM/YYYY')} ${registro.hora_actual}`,
        }));
        setData(registros);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);
  // Reiniciamos la página cuando cambia el filtro o su valor
  useEffect(() => {
    setCurrentPage(1);
  }, [filterField, filterValue]);
  // Filtrado en base al campo seleccionado y valor ingresado
  const filteredData = data.filter((registro) => {
    if (filterValue === '') return true;
    return registro[filterField]
      .toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  });
  // Paginación sobre los datos filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  // Función para navegar páginas
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
    let endPage = startPage + 4 <= totalPages ? startPage + 4 : totalPages;
    if (endPage - startPage < 4) {
      startPage = endPage - 4 > 0 ? endPage - 4 : 1;
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md border border-blue-600 font-medium ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };
  // Opciones de filtrado permitidas
  const filterOptions = [
    { label: 'Enter Date', value: 'enterDate' },
    { label: 'Tray Number', value: 'trayNumber' },
    { label: 'Current Station', value: 'currentStation' },
    { label: 'Current Date', value: 'currentStnDate' },
    { label: 'Division', value: 'division' },
    { label: 'F/S', value: 'fs' },
  ];
  return (
    <>
      <div className="mt-6 md:mt-0">
        <Heading title="Reporte de Trabajos Sin Movimientos" />
      </div>
      <div className="mt-6 lg:mt-0 bg-gray-100 min-h-screen p-4">
        {/* Sección de última actualización (visible en pantallas medianas en adelante) */}
        <div className="bg-gray-200 p-4 mb-4 rounded flex justify-between xs:hidden md:flex">
            <div className="flex gap-1">
              <img src="/img/clock.png" alt="reloj" width={25} />
              <p className="text-gray-700 font-bold uppercase">
                Última actualización: {ultimaActualizacion}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800 uppercase">
                Actualización cada hora.
              </p>
            </div>
          </div>
         {/* Sección de filtros */}
          <div className="mt-8 mx-4 mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <label className="text-gray-600 font-medium">
              Filtrar por:
              <select
                className="ml-2 p-2 border rounded-md"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <input
              type="text"
              placeholder="Ingrese el valor a buscar..."
              className="mt-2 md:mt-0 w-60 p-2 border rounded-md"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        {/* Vista para pantallas grandes (se muestra a partir de lg; tipografía algo más pequeña) */}
        <div className="overflow-x-auto hidden lg:block text-sm">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-5 text-left font-semibold">ID</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Enter Date</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Tray Number</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Current Station</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Division</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Current Stn Date</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Current Stn Time</th>
                <th className="py-3 px-5 text-left font-semibold border-l">F/S</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Dia Actual</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Hora Actual</th>
                <th className="py-3 px-5 text-left font-semibold border-l">Transcurrido</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((registro, index) => (
                <tr
                  key={index}
                  className={`border-t border-gray-200 hover:bg-blue-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <td className="py-3 px-5 border text-gray-500">{registro.id}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.enterDate}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.trayNumber}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.currentStation}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.division}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.currentStnDate}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.currentStnTime}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.fs}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.diaActual}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.horaActual}</td>
                  <td className="py-3 px-5 border text-gray-500">{registro.transcurrido}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginador para pantallas grandes */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-b-lg mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {filteredData.length === 0 ? 0 : indexOfFirstItem + 1} -{' '}
              {indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem} de{' '}
              {filteredData.length} registros
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === 1}
              >
                {'<<'}
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === totalPages}
              >
                {'>>'}
              </button>
            </div>
          </div>
        </div>
        {/* Vista para móviles y pantallas medianas (se muestra en pantallas menores que lg) */}
        <div className="lg:hidden space-y-4">
          {currentData.map((registro, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md"
            >
              <div className="bg-blue-600 text-white p-4">
                <div className="font-semibold text-lg">{registro.enterDate}</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-bold text-gray-500">{registro.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Tray Number:</span>
                  <span className="font-bold text-gray-500">{registro.trayNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Current Station:</span>
                  <span className="font-bold text-gray-500">{registro.currentStation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Division:</span>
                  <span className="font-bold text-gray-500">{registro.division}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Current Stn Date:</span>
                  <span className="font-bold text-gray-500">{registro.currentStnDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Current Stn Time:</span>
                  <span className="font-bold text-gray-500">{registro.currentStnTime}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">F/S:</span>
                  <span className="font-bold text-gray-500">{registro.fs}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Transcurrido:</span>
                  <span className="font-bold text-gray-500">{registro.transcurrido}</span>
                </div>
              </div>
            </div>
          ))}
          {/* Paginador para móviles */}
          <div className="flex flex-col space-y-2 bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center text-sm text-gray-600">
              Mostrando {filteredData.length === 0 ? 0 : indexOfFirstItem + 1} -{' '}
              {indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem} de{' '}
              {filteredData.length} registros
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => goToPage(1)}
                className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === 1}
              >
                {'<<'}
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
                disabled={currentPage === totalPages}
              >
                {'>>'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReporteTrabajosSinMovimientos;