import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/clienteAxios';

const agruparDatos = (registros) => {
  const grupos = {
    surtido: [],
    bloqueoTallado: [],
    generadores: [],
    pulido: [],
    engraver: [],
    ar: [],
    recubrimiento: [],
    desbloqueo: [],
    bloqueoTerminado: [],
    biselado: [],
    produccion: [],
    enCola: [],
    HardCoat: []
  };

  const totalesPorEstacion = {};
  const totalesPorCliente = {
    NVI: { total: 0, finished: 0, semifinished: 0 },
    HOYA: { total: 0, finished: 0, semifinished: 0 },
    INK: { total: 0, finished: 0, semifinished: 0 }
  };
  const totalesFinishedSemifinished = {
    finished: 0,
    semifinished: 0
  };

  registros.forEach(registro => {
    const { estacion, total, sf, NVI, HOYA, INK, f_count, s_count } = registro;
    if (!totalesPorEstacion[estacion]) {
      totalesPorEstacion[estacion] = {
        nombre: estacion,
        F: 0,
        S: 0,
        total: 0
      };
    }
    totalesPorEstacion[estacion][sf] += total;
    totalesPorEstacion[estacion].total += total;

    // Distribuir f_count y s_count proporcionalmente entre los clientes
    const totalClientes = NVI + HOYA + INK;
    if (totalClientes > 0) {
      const factorNVI = NVI / totalClientes;
      const factorHOYA = HOYA / totalClientes;
      const factorINK = INK / totalClientes;

      totalesPorCliente.NVI.total += NVI;
      totalesPorCliente.NVI.finished += f_count * factorNVI;
      totalesPorCliente.NVI.semifinished += s_count * factorNVI;

      totalesPorCliente.HOYA.total += HOYA;
      totalesPorCliente.HOYA.finished += f_count * factorHOYA;
      totalesPorCliente.HOYA.semifinished += s_count * factorHOYA;

      totalesPorCliente.INK.total += INK;
      totalesPorCliente.INK.finished += f_count * factorINK;
      totalesPorCliente.INK.semifinished += s_count * factorINK;
    }

    totalesFinishedSemifinished.finished += f_count;
    totalesFinishedSemifinished.semifinished += s_count;
  });

  // Clasificación de estaciones
  Object.entries(totalesPorEstacion).forEach(([estacion, datos]) => {
    if (['19 LENS LOG-SF', '20 LENS LOG-FIN'].includes(estacion)) {
      grupos.surtido.push(datos);
    } else if (['220 SRFBLK 1', '221 SRFBLK 2', '222 SRFBLK 3', '223 SRFBLK 4', '224 SRFBLK 5', '225 SRFBLK 6'].includes(estacion)) {
      grupos.bloqueoTallado.push(datos);
    } else if (['241 GENERATOR 1', '242 GENERATOR 2', '243 ORBIT 4 LA', '244 ORBIT 3 LA', '245 ORBIT 1 LA', '246 ORBIT 2 LA', '247 SCHNIDER 1', '248 SCHNIDER 2'].includes(estacion)) {
      grupos.generadores.push(datos);
    } else if (['254 IFLEX SRVR', '255 POLISHR 1', '256 POLISHR 2', '257 POLISHR 3', '259 POLISHR 5', '260 POLISHR 6', '262 POLISHR 8', '266 MULTIFLEX 1', '267 MULTIFLEX 2', '268 MULTIFLEX 3', '269 MULTIFLEX 4', '265 POLISHR 12'].includes(estacion)) {
      grupos.pulido.push(datos);
    } else if (['272 ENGRVR 3', '273 ENGRVR 4', '270 ENGRVR 1', '271 ENGRVR 2'].includes(estacion)) {
      grupos.engraver.push(datos);
    } else if (['52 FUSION', '53 1200 D', '54 OAC.120', '55 TLF 1200.1', '56 TLF 1200.2'].includes(estacion)) {
      grupos.ar.push(datos);
    } else if (['60 AR ENTRADA', '61 AR SALIDA'].includes(estacion)) {
      grupos.recubrimiento.push(datos);
    } else if (estacion === '320 DEBLOCKING 1') {
      grupos.desbloqueo = [datos];
    } else if (['280 FINBLKR 1', '281 FINBLKR 2', '282 FINBLKR 3'].includes(estacion)) {
      grupos.bloqueoTerminado.push(datos);
    } else if (['299 BISPHERA', '300 EDGER 1', '301 EDGER 2', '302 EDGER 3', '303 EDGER 4', '304 EDGER 5', '305 EDGER 6', '306 EDGER 7', '307 EDGER 8', '308 EDGER 9', '309 EDGER 10', '310 EDGER 11', '311 EDFGER 12', '312 RAZR', '313 EDGER 13', '314 EDGER 14', '316 EDGER 15', '317 EDGER 16', '327 EDGER 17', '328 EDGER 18', '329 EDGER 19', '330 EDGER 20', '331 EDGER 21', '332 EDGER 22', '333 EDGER 23', '334 EDGER 24', '318 HSE 1', '319 HSE 2'].includes(estacion)) {
      grupos.biselado.push(datos);
    } else if (estacion === '32 JOB COMPLETE') {
      grupos.produccion.push(datos);
    } else if (['136 Q-NVI P F', '137 Q-NVI PLY F', '138 Q-NVI B F AR', '139 Q-NVI BLY F', '141 Q-NVI BLY AR', 'Q-HOYA JOBS', 'Q-INK NO QOH', '140 Q-NVI BLY', '141 Q-NVI BLY AR', '142 Q-NVI BLY TR', '143 Q-NVI BLY AT', '144 Q-NVI CR A T', '145 Q-NVI PY AT', '146 Q-NVI PLY TR', '147 Q-NVI CR39', '148 Q-NVI PLY AR', '149 Q-NVI TRACE', '150 Q-DIG CALC', '151 Q-CALC FAIL', '152 Q-NVI JOBS', '153 Q-NVI NO ES', '154 Q-NVI AR', '155 Q-NVI NO QOH', 'Q-HOYA BAD PICK', 'Q-LENS ISSUE', 'Q-INK', 'Q-HIPWR', 'Q-HOYA NO QOH', 'Q-INK NO QOH', 'Q-JAI KUDO JOBS' ].includes(estacion)) {
      grupos.enCola.push(datos);
    } else if (['48 MR3.1', '50 MR3.3', '91 VELOCITY 1', '92 VELOCITY 2'].includes(estacion)) {
      grupos.HardCoat.push(datos);
    }
  });

  return { grupos, totalesPorCliente, totalesFinishedSemifinished };
};

const ModuloReporte = ({ titulo, datos, esCompacto = false }) => {
  const totalTrabajos = esCompacto ? datos.total : datos.reduce((sum, item) => sum + item.total, 0);
  const totalFinished = esCompacto ? datos.F : datos.reduce((sum, item) => sum + item.F, 0);
  const totalSemifinished = esCompacto ? datos.S : datos.reduce((sum, item) => sum + item.S, 0);
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{minHeight: '300px'}}>
      <div className="bg-blue-500 px-4 py-2">
        <h2 className="text-lg font-semibold text-white text-center">{titulo}</h2>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        {esCompacto ? (
          <>
            <div className="text-center mb-4">
              <h3 className="text-base font-medium text-gray-600 mb-1">{datos.nombre}</h3>
              <span className="text-3xl font-semibold text-blue-500">{datos.total}</span>
              <span className="text-gray-600 text-xs ml-1">trabajos</span>
            </div>
            <div className="mt-auto pt-3 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Resumen</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Finished</p>
                  <p className="text-lg font-semibold text-blue-500">{datos.F}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Semifinished</p>
                  <p className="text-lg font-semibold text-blue-500">{datos.S}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 py-2">
              {datos.map((item, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded-lg">
                  <h3 className="font-medium text-gray-700 text-xs mb-1">{item.nombre}</h3>
                  <span className="text-lg font-semibold text-blue-500">{item.total}</span>
                  <span className="text-gray-600 text-xs ml-1">trabajos</span>
                  <div className="text-xs text-gray-500 mt-1">
                    T: {item.F} | S: {item.S}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Resumen</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Total Trabajos</p>
                  <p className="text-lg font-semibold text-blue-500">{totalTrabajos}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Terminado</p>
                  <p className="text-lg font-semibold text-blue-500">{totalFinished}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Semiterminado</p>
                  <p className="text-lg font-semibold text-blue-500">{totalSemifinished}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Reporte = () => {
  const [datosAgrupados, setDatosAgrupados] = useState(null);
  const [totalesPorCliente, setTotalesPorCliente] = useState(null);
  const [totalesFinishedSemifinished, setTotalesFinishedSemifinished] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await clienteAxios.get('/reportes/reportes/produccion');
        const { grupos, totalesPorCliente, totalesFinishedSemifinished } = agruparDatos(response.data.registros);
        setDatosAgrupados(grupos);
        setTotalesPorCliente(totalesPorCliente);
        setTotalesFinishedSemifinished(totalesFinishedSemifinished);
        actualizarHora();
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const actualizarHora = () => {
      const ahora = new Date();
      let ultimaActualizacion;
      if (ahora.getMinutes() >= 35) {
        ultimaActualizacion = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), ahora.getHours(), 35, 0);
      } else {
        ultimaActualizacion = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), ahora.getHours() - 1, 35, 0);
      }
      const horaFormateada = ultimaActualizacion.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setUltimaActualizacion(horaFormateada);
    };

    const calcularTiempoHastaProximaActualizacion = () => {
      const ahora = new Date();
      const proximaActualizacion = new Date(ahora);
      if (ahora.getMinutes() >= 35) {
        proximaActualizacion.setHours(ahora.getHours() + 1);
      }
      proximaActualizacion.setMinutes(35, 0, 0);
      return proximaActualizacion - ahora;
    };

    fetchDatos();
    const timeout = setTimeout(() => {
      fetchDatos();
      const intervalo = setInterval(fetchDatos, 3600000);
      return () => clearInterval(intervalo);
    }, calcularTiempoHastaProximaActualizacion());

    return () => clearTimeout(timeout);
  }, []);

  if (!datosAgrupados || !totalesPorCliente || !totalesFinishedSemifinished) {
    return <div>Cargando...</div>
  }

  return (
    <div className="mx-auto mt-6 md:mt-0">
      <div className='bg-gray-200 p-4 mb-6 rounded flex justify-between xs:hidden md:flex'>
        <div className='flex gap-1'>
          <img src="/img/clock.png" alt="reloj" width={25}/>
          <p className='text-gray-700 font-bold uppercase'>Última actualización: {ultimaActualizacion}</p>
        </div>
        <div>
          <p className='font-medium text-gray-800 uppercase'>Actualización cada hora</p>
        </div>
      </div>

      <div className="bg-white p-4 mb-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="lg:text-lg font-semibold text-gray-400 lg:text-gray-500 mb-3 uppercase text-center">Resumen por Cliente</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(totalesPorCliente).map(([cliente, datos]) => (
                <div key={cliente} className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-600">{cliente}</p>
                  <p className="text-2xl font-bold text-blue-600">{datos.total}</p>
                  <p className="text-xs text-gray-500 mb-2">trabajos</p>
                  <div className="border-t border-gray-200 pt-2 mt-1">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <p className='text-gray-500 lg:hidden'>T</p>
                        <p className="text-gray-500 hidden lg:block">Terminado</p>
                        <p className="text-green-600 font-semibold">{Math.round(datos.finished)}</p>
                      </div>
                      <div>
                        <p className='text-gray-500 lg:hidden'>S</p>
                        <p className="text-gray-500 hidden lg:block">Semiterminado</p>
                        <p className="text-yellow-600 font-semibold">{Math.round(datos.semifinished)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-100 p-3 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-600">Total General</p>
              <p className="text-2xl font-bold text-blue-600">
                {Object.values(totalesPorCliente).reduce((a, b) => a + b.total, 0)}
              </p>
              <p className="text-xs text-gray-500">trabajos totales</p>
            </div>
          </div>
          <div>
            <h3 className="lg:text-lg font-semibold text-gray-400 lg:text-gray-500 mb-3 uppercase text-center">Resumen Terminado y Semiterminado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded-lg text-center min-h-32">
                <p className="text-sm font-medium text-gray-600 mt-4">Terminado</p>
                <p className="text-2xl font-bold text-green-600">{totalesFinishedSemifinished.finished}</p>
                <p className="text-xs text-gray-500">trabajos</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-600 mt-4">Semiterminado</p>
                <p className="text-2xl font-bold text-yellow-600">{totalesFinishedSemifinished.semifinished}</p>
                <p className="text-xs text-gray-500">trabajos</p>
              </div>
            </div>
            <div className="mt-4 bg-blue-100 p-3 rounded-lg text-center lg:relative top-3">
              <p className="text-sm font-medium text-gray-600">Total General</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalesFinishedSemifinished.finished + totalesFinishedSemifinished.semifinished}
              </p>
              <p className="text-xs text-gray-500">trabajos totales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuloReporte titulo="En Cola" datos={datosAgrupados.enCola} />
        <ModuloReporte titulo="Surtido" datos={datosAgrupados.surtido} />
        <ModuloReporte titulo="Bloqueo de Tallado" datos={datosAgrupados.bloqueoTallado} />
        <ModuloReporte titulo="Generado" datos={datosAgrupados.generadores} />
        <ModuloReporte titulo="Pulido" datos={datosAgrupados.pulido} />
        <ModuloReporte titulo="Engraver" datos={datosAgrupados.engraver} />
        <ModuloReporte titulo="Debloqueo" datos={datosAgrupados.desbloqueo[0] || { nombre: "320 DEBLOCKING 1", total: 0, F: 0, S: 0 }} esCompacto={true} />
        <ModuloReporte titulo="AR" datos={datosAgrupados.ar} />
        <ModuloReporte titulo='Recubrimiento' datos={datosAgrupados.recubrimiento} />
        <ModuloReporte titulo="Hard Coat" datos={datosAgrupados.HardCoat} />
        <ModuloReporte titulo="Bloqueo de Terminado" datos={datosAgrupados.bloqueoTerminado} />
        <ModuloReporte titulo="Biselado" datos={datosAgrupados.biselado} />
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Notas importantes</h3>
        <p className="text-gray-600">
          Este reporte se actualiza automáticamente cada hora.
        </p>
      </div>
    </div>
  );
};

export default Reporte;