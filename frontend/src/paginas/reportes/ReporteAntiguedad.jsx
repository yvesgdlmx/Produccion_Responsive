import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/clienteAxios';
import { startOfWeek, endOfWeek, format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const ReporteAntiguedad = () => {
  const [registros, setRegistros] = useState([]);
  const [mes, setMes] = useState('');
  const [totalRegistrosAntiguos, setTotalRegistrosAntiguos] = useState(0);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await clienteAxios.get('/reportes/reportes/antiguedad');
        setRegistros(data.registros);
        calcularTotalRegistrosAntiguos(data.registros);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    obtenerDatos();
  }, []);

  const calcularTotalRegistrosAntiguos = (registros) => {
    const total = registros.reduce((acc, registro) => {
      const dias = differenceInDays(parseISO(registro.today), parseISO(registro.enter_date));
      if (dias >= 4) {
        return acc + registro.ink_ip + registro.hoya_ip + registro.nvi_ip;
      }
      return acc;
    }, 0);
    setTotalRegistrosAntiguos(total);
  };

  const agruparPorSemana = (registros) => {
    if (!registros || registros.length === 0) return [];

    const semanas = {};
    
    registros.forEach(registro => {
      const fecha = parseISO(registro.enter_date);
      const inicioSemana = format(startOfWeek(fecha, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      if (!semanas[inicioSemana]) {
        semanas[inicioSemana] = [];
      }
      
      semanas[inicioSemana].push(registro);
    });

    return Object.entries(semanas);
  };

  const semanasAgrupadas = agruparPorSemana(registros);

  return (
    <div className="mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-blue-500 text-center md:text-left">
          Reporte de Antigüedad
        </h2>
        
        <select 
          className="w-full mb-6 p-2 border border-gray-300 rounded-md shadow-sm 
                     focus:border-blue-500 focus:ring focus:ring-blue-200 
                     focus:ring-opacity-50 bg-white"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          <option value="">Selecciona un mes</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-sm">
          <p className="text-blue-800 font-medium text-center">
            Total General (Registros ≥ 4 días): 
            <span className="text-blue-600 font-bold ml-2">{totalRegistrosAntiguos}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {semanasAgrupadas.map(([inicioSemana, registrosSemana]) => (
            <div key={inicioSemana} 
                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg 
                          transition-shadow duration-300 border border-gray-100">
              <h3 className="text-lg font-medium mb-3 text-blue-500 border-b pb-2">
                Semana del {format(parseISO(inicioSemana), 'dd MMMM yyyy', { locale: es })}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Fecha de Entrada
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Fecha Actual
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        INK IP
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        HOYA IP
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        NVI IP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrosSemana.map((registro, index) => {
                      const diasDiferencia = differenceInDays(parseISO(registro.today), parseISO(registro.enter_date));
                      const esAntiguo = diasDiferencia >= 4;
                      return (
                        <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${esAntiguo ? 'bg-yellow-50' : ''}`}>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                            {format(parseISO(registro.enter_date), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                            {format(parseISO(registro.today), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                            {registro.ink_ip}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                            {registro.hoya_ip}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                            {registro.nvi_ip}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 pt-3 border-t flex justify-end items-center">
                <p className="text-sm font-medium text-gray-700">
                  Total IP (≥ 4 días): {' '}
                  <span className="text-blue-500 font-semibold">
                    {registrosSemana.reduce((total, registro) => {
                      const dias = differenceInDays(parseISO(registro.today), parseISO(registro.enter_date));
                      if (dias >= 4) {
                        return total + registro.ink_ip + registro.hoya_ip + registro.nvi_ip;
                      }
                      return total;
                    }, 0)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReporteAntiguedad;