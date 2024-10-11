import { useState, useEffect } from "react";
import clienteAxios from "../../../config/clienteAxios";
import Navegacion from "../others/Navegacion";
import moment from 'moment-timezone';

const Totales_Produccion_Maquina = () => {
  const [registros, setRegistros] = useState([]);
  const [horasUnicas, setHorasUnicas] = useState([]);
  const [meta, setMeta] = useState(0);
  const [totalesAcumulados, setTotalesAcumulados] = useState(0);
  const [totalesPorTurno, setTotalesPorTurno] = useState({
    matutino: 0,
    vespertino: 0,
    nocturno: 0
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const responseMetas = await clienteAxios('/metas/metas-manuales');
        const metasJobComplete = responseMetas.data.registros.filter(meta => meta.name.includes('JOB COMPLETE'));
        const sumaMetas = metasJobComplete.reduce((acc, meta) => acc + meta.meta, 0);
        setMeta(sumaMetas);

        const responseRegistros = await clienteAxios('/manual/manual/actualdia');
        const dataRegistros = responseRegistros.data.registros || [];

        const ahora = moment().tz('America/Mexico_City');
        let inicioHoy = moment().tz('America/Mexico_City').startOf('day').add(6, 'hours').add(30, 'minutes');
        let finHoy = moment(inicioHoy).add(1, 'days');

        if (ahora.isBefore(inicioHoy)) {
          inicioHoy.subtract(1, 'days');
          finHoy.subtract(1, 'days');
        }

        const registrosFiltrados = dataRegistros.filter(registro => {
          const fechaHoraRegistro = moment.tz(`${registro.fecha} ${registro.hour}`, 'YYYY-MM-DD HH:mm:ss', 'America/Mexico_City');
          return fechaHoraRegistro.isBetween(inicioHoy, finHoy, null, '[]') && registro.name.includes('JOB COMPLETE');
        });

        const horas = new Set();
        let totalAcumulado = 0;
        const totales = { matutino: 0, vespertino: 0, nocturno: 0 };

        registrosFiltrados.forEach(registro => {
          horas.add(registro.hour);
          totalAcumulado += parseInt(registro.hits || 0);
          const fechaHoraRegistro = moment.tz(`${registro.fecha} ${registro.hour}`, 'YYYY-MM-DD HH:mm:ss', 'America/Mexico_City');
          if (fechaHoraRegistro.isBetween(inicioHoy, moment(inicioHoy).add(8, 'hours'), null, '[)')) {
            totales.matutino += parseInt(registro.hits || 0);
          } else if (fechaHoraRegistro.isBetween(moment(inicioHoy).add(8, 'hours'), moment(inicioHoy).add(15, 'hours'), null, '[)')) {
            totales.vespertino += parseInt(registro.hits || 0);
          } else {
            totales.nocturno += parseInt(registro.hits || 0);
          }
        });

        const horasArray = Array.from(horas).sort((a, b) => {
          const momentA = moment(a, 'HH:mm:ss');
          const momentB = moment(b, 'HH:mm:ss');
          if (momentA.isBefore(moment('06:30', 'HH:mm'))) momentA.add(1, 'day');
          if (momentB.isBefore(moment('06:30', 'HH:mm'))) momentB.add(1, 'day');
          return momentB.diff(momentA);
        });

        const horasConFormato = horasArray.map(hora => {
          const [horaInicial, minutos] = hora.split(':');
          const momentoInicial = moment(hora, 'HH:mm:ss');
          const momentoFinal = moment(momentoInicial).add(1, 'hour');
          return `${horaInicial}:${minutos} - ${momentoFinal.format('HH:mm')}`;
        });

        setHorasUnicas(horasConFormato);
        setTotalesAcumulados(totalAcumulado);
        setRegistros(registrosFiltrados);
        setTotalesPorTurno(totales);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    cargarDatos();
  }, []);

  const sumaHitsPorHora = horasUnicas.map(hora => {
    const [horaInicio, horaFin] = hora.split(' - ');
    return registros.filter(r => {
      const hourMoment = moment(r.hour, 'HH:mm:ss');
      const startMoment = moment(horaInicio, 'HH:mm');
      const endMoment = moment(horaFin, 'HH:mm');
      if (startMoment.isAfter(endMoment)) {
        return hourMoment.isSameOrAfter(startMoment) || hourMoment.isBefore(endMoment);
      } else {
        return hourMoment.isSameOrAfter(startMoment) && hourMoment.isBefore(endMoment);
      }
    }).reduce((acc, curr) => acc + parseInt(curr.hits || 0), 0);
  });

  const metaMatutinoFinal = meta * 8; // 8 horas
  const metaVespertinoFinal = meta * 7; // 7 horas
  const metaNocturnoFinal = meta * 4; // 4 horas
  const claseSumaTotalAcumulados = totalesAcumulados >= (metaMatutinoFinal + metaVespertinoFinal + metaNocturnoFinal) ? "text-green-500" : "text-red-500";

  const getClassName = (hits, metaPorTurno) => {
    return hits >= metaPorTurno ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="max-w-screen-xl">
      {/* Diseño tipo card para pantallas pequeñas y medianas */}
      <div className="lg:hidden mt-4">
        <div className="bg-white shadow-md rounded-lg mb-4 p-6">
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold text-gray-700">Nombre:</span>
            <span className="font-bold text-gray-700">Producción</span>
          </div>
          <div className="flex justify-between border-b py-4">
            <span className="font-bold text-gray-700">Total Acumulado:</span>
            <span className={`font-bold ${claseSumaTotalAcumulados}`}>{totalesAcumulados}</span>
          </div>
          <div className="flex justify-between border-b py-4">
            <span className="font-bold text-gray-700">Meta:</span>
            <span className="font-bold text-gray-700">{meta || 'No definida'}</span>
          </div>
          <div className="py-4">
            <span className="font-bold text-gray-700">Horas:</span>
            {horasUnicas.map((hora, idx) => {
              const [horaInicio, horaFin] = hora.split(' - ');
              const totalHits = registros.filter(r => {
                const hourMoment = moment(r.hour, 'HH:mm:ss');
                const startMoment = moment(horaInicio, 'HH:mm');
                const endMoment = moment(horaFin, 'HH:mm');
                if (startMoment.isAfter(endMoment)) {
                  return hourMoment.isSameOrAfter(startMoment) || hourMoment.isBefore(endMoment);
                } else {
                  return hourMoment.isSameOrAfter(startMoment) && hourMoment.isBefore(endMoment);
                }
              }).reduce((acc, curr) => acc + parseInt(curr.hits || 0), 0);
              const bgColor = idx % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300';
              const hitsClass = totalHits >= meta ? "text-green-500" : "text-red-500";
              return (
                <div key={idx} className={`flex justify-between py-2 px-4 ${bgColor}`}>
                  <span className="font-bold text-gray-700">{hora}:</span>
                  <span className={`font-bold ${hitsClass}`}>{totalHits}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Diseño de tabla para pantallas grandes */}
      <div className="hidden lg:block">
        <Navegacion/>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b" style={{ minWidth: '250px' }}>Nombre</th>
              <th className="py-2 px-4 border-b">Total Acumulado</th>
              <th className="py-2 px-4 border-b">Meta</th>
              {horasUnicas.map((hora, index) => (
                <th key={index} className="py-2 px-4 border-b whitespace-nowrap">{hora}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            <tr className="font-semibold text-gray-700">
              <td className="py-2 px-4 border-b font-bold" style={{ minWidth: '250px' }}>Producción</td>
              <td className={`py-2 px-4 border-b font-bold ${claseSumaTotalAcumulados}`}>{totalesAcumulados}</td>
              <td className="py-2 px-4 border-b font-bold">{meta || 'No definida'}</td>
              {horasUnicas.map((hora, idx) => {
                const [horaInicio, horaFin] = hora.split(' - ');
                const totalHits = registros.filter(r => {
                  const hourMoment = moment(r.hour, 'HH:mm:ss');
                  const startMoment = moment(horaInicio, 'HH:mm');
                  const endMoment = moment(horaFin, 'HH:mm');
                  if (startMoment.isAfter(endMoment)) {
                    return hourMoment.isSameOrAfter(startMoment) || hourMoment.isBefore(endMoment);
                  } else {
                    return hourMoment.isSameOrAfter(startMoment) && hourMoment.isBefore(endMoment);
                  }
                }).reduce((acc, curr) => acc + parseInt(curr.hits || 0), 0);
                const claseHitsIndividual = totalHits >= meta ? "text-green-500" : "text-red-500";
                return (
                  <td key={idx} className={`font-bold py-2 px-4 border-b ${claseHitsIndividual}`}>
                    {totalHits}
                  </td>
                );
              })}
            </tr>
            <tr className="font-semibold bg-green-200 text-gray-700">
              <td className="py-2 px-4 border-b font-bold" style={{ minWidth: '250px' }}>Totales</td>
              <td className={`py-2 px-4 border-b fw font-bold ${claseSumaTotalAcumulados}`}>{totalesAcumulados}</td>
              <td className="py-2 px-4 border-b fw font-bold">{meta}</td>
              {sumaHitsPorHora.map((sumaHits, index) => {
                const claseSumaHits = sumaHits >= meta ? "text-green-500" : "text-red-500";
                return (
                  <td key={index} className={`font-bold py-2 px-4 border-b fw ${claseSumaHits}`}>{sumaHits}</td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Totales por turno */}
      <div className='flex flex-col md:flex-row justify-around mt-4 font-semibold mb-4'>
        <div className="bg-white p-2 px-10 rounded-lg mb-2 md:mb-0">
          <p className="text-gray-700 text-sm md:text-base">Total Matutino: <span className={getClassName(totalesPorTurno.matutino, metaMatutinoFinal)}>{totalesPorTurno.matutino}</span></p>
        </div>
        <div className="bg-white p-2 px-10 rounded-lg mb-2 md:mb-0">
          <p className="text-gray-700 text-sm md:text-base">Total Vespertino: <span className={getClassName(totalesPorTurno.vespertino, metaVespertinoFinal)}>{totalesPorTurno.vespertino}</span></p>
        </div>
        <div className="bg-white p-2 px-10 rounded-lg">
          <p className="text-gray-700 text-sm md:text-base">Total Nocturno: <span className={getClassName(totalesPorTurno.nocturno, metaNocturnoFinal)}>{totalesPorTurno.nocturno}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Totales_Produccion_Maquina;