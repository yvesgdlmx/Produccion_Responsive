import { useState, useEffect } from "react";
import clienteAxios from "../../../config/clienteAxios";

const estaciones = {
  "Surtido": ["19 LENS LOG"],
  "Bloqueo de tallado": ["220 SRFBLK 1", "221 SRFBLK 2", "222 SRFBLK 3", "223 SRFBLK 4", "224 SRFBLK 5", "225 SRFBLK 6"],
  "Generado": ["241 GENERATOR 1", "242 GENERATOR 2", "245 ORBIT 1 LA", "246 ORBIT 2 LA", "244 ORBIT 3 LA", "243 ORBIT 4 LA", "247 SCHNIDER 1", "248 SCHNIDER 2"],
  "Pulido": ["255 POLISHR 1", "257 POLISHR 3", "259 POLISHR 5", "262 POLISHR 8", "265 POLISHR 12", "266 MULTIFLEX 1", "267 MULTIFLEX 2", "268 MULTIFLEX 3", "269 MULTIFLEX 4", "254 IFLEX SRVR"],
  "Engraver": ["270 ENGRVR 1", "271 ENGRVR 2", "272 ENGRVR 3", "273 ENGRVR 4"],
  "Desbloqueo": ["320 DEBLOCKING 1"],
  "AntiReflejante": ["91 VELOCITY 1", "92 VELOCITY 2", "52 FUSION", "53 1200 D", "55 TLF 1200.1", "56 TLF 1200.2"],
  "Bloqueo de terminado": ["280 FINBLKR 1", "281 FINBLKR 2", "282 FINBLKR 3"],
  "Biselado": ["300 EDGER 1", "301 EDGER 2", "302 EDGER 3", "303 EDGER 4", "304 EDGER 5", "305 EDGER 6", "306 EDGER 7", "307 EDGER 8", "308 EDGER 9", "309 EDGER 10", "310 EDGER 11", "311 EDFGER 12", "299 BISPHERA", "312 RAZR"],
  "Producción": ["32 JOB COMPLETE"],
};

const Historial_Por_Rangos = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const [anio, setAnio] = useState(yesterday.getFullYear().toString());
  const [mes, setMes] = useState((yesterday.getMonth() + 1).toString().padStart(2, '0'));
  const [diaInicio, setDiaInicio] = useState(yesterday.getDate().toString());
  const [diaFin, setDiaFin] = useState(yesterday.getDate().toString());
  const [registros, setRegistros] = useState([]);

  const handleAnioChange = (e) => {
    setAnio(e.target.value);
  };

  const handleMesChange = (e) => {
    setMes(e.target.value);
  };

  const handleDiaInicioChange = (e) => {
    setDiaInicio(e.target.value);
  };

  const handleDiaFinChange = (e) => {
    setDiaFin(e.target.value);
  };

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const { data } = await clienteAxios(`/historial/historial-3/${anio}/${mes}/${diaInicio}/${diaFin}`);
        console.log("Datos obtenidos de la API:", data);
        setRegistros(data.registros || []);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
        setRegistros([]);
      }
    };
    obtenerRegistros();
  }, [anio, mes, diaInicio, diaFin]);

  const registrosFiltrados = registros.filter(({ hour }) => {
    const [hora, minuto] = hour.split(':').map(Number);
    const horaEnMinutos = hora * 60 + minuto;
    return horaEnMinutos >= 390 && horaEnMinutos <= 1380;
  });

  const registrosAgrupados = registrosFiltrados.reduce((acc, registro) => {
    const { name, hits, hour } = registro;
    if (!acc[name]) {
      acc[name] = { hits: 0, turnos: { matutino: 0, vespertino: 0, nocturno: 0 } };
    }
    acc[name].hits += hits;
    const [hora, minuto] = hour.split(':').map(Number);
    if ((hora > 6 || (hora === 6 && minuto >= 30)) && (hora < 14 || (hora === 14 && minuto < 30))) {
      acc[name].turnos.matutino += hits;
    } else if ((hora > 14 || (hora === 14 && minuto >= 30)) && (hora < 21 || (hora === 21 && minuto < 30))) {
      acc[name].turnos.vespertino += hits;
    } else if ((hora > 19 || (hora === 19 && minuto >= 30)) || (hora < 2 || (hora === 1 && minuto < 30))) {
      acc[name].turnos.nocturno += hits;
    }
    return acc;
  }, {});

  const hitsPorEstacionYTurno = Object.entries(estaciones).reduce((acc, [nombreEstacion, maquinas]) => {
    acc[nombreEstacion] = { matutino: 0, vespertino: 0, nocturno: 0 };
    maquinas.forEach(maquina => {
      const registro = registrosAgrupados[maquina];
      if (registro) {
        acc[nombreEstacion].matutino += registro.turnos.matutino;
        acc[nombreEstacion].vespertino += registro.turnos.vespertino;
        acc[nombreEstacion].nocturno += registro.turnos.nocturno;
      }
    });
    return acc;
  }, {});

  const totalHitsPorTurno = Object.values(hitsPorEstacionYTurno).reduce((acc, { matutino, vespertino, nocturno }) => {
    acc.matutino += matutino;
    acc.vespertino += vespertino;
    acc.nocturno += nocturno;
    return acc;
  }, { matutino: 0, vespertino: 0, nocturno: 0 });

  const totalHits = Object.values(registrosAgrupados).reduce((acc, { hits }) => acc + hits, 0);

  const renderizarTablasPorEstacion = () => {
    return Object.entries(estaciones).map(([nombreEstacion, maquinas]) => {
      const registrosEstacion = maquinas.map((maquina) => registrosAgrupados[maquina]).filter(Boolean);
      if (registrosEstacion.length === 0) return null;
      return (
        <div key={nombreEstacion} className="mb-8">
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 border-b text-center font-medium w-1/3">Nombre</th>
                <th className="py-2 px-4 border-b text-center font-medium w-1/3">Fecha</th>
                <th className="py-2 px-4 border-b text-center font-medium w-1/3">Hits</th>
              </tr>
            </thead>
            <tbody>
              {registrosEstacion.map((registro, index) => {
                const maquina = maquinas[index];
                return (
                  <tr key={index} className="bg-white even:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center w-1/3">{maquina}</td>
                    <td className="py-2 px-4 border-b text-center w-1/3">{`${anio}-${mes}-${diaInicio} al ${diaFin}`}</td>
                    <td className="py-2 px-4 border-b text-center w-1/3">{registro.hits}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
  };

  const renderizarTotalesPorEstacionYTurno = () => {
    return Object.entries(hitsPorEstacionYTurno).map(([nombreEstacion, turnos]) => (
      <div key={nombreEstacion} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg mb-2">{nombreEstacion}</h3>
        <div className="flex flex-col sm:flex-row justify-between">
          <p>Turno matutino: <span className="font-bold text-blue-700">{turnos.matutino}</span></p>
          <p>Turno vespertino: <span className="font-bold text-blue-700">{turnos.vespertino}</span></p>
          <p>Turno nocturno: <span className="font-bold text-blue-700">{turnos.nocturno}</span></p>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <label className="block mb-1 sm:mb-2 text-gray-600">Año</label>
          <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg" value={anio} onChange={handleAnioChange}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-gray-600">Mes</label>
          <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg" value={mes} onChange={handleMesChange}>
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-gray-600">Día Inicio</label>
          <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg" value={diaInicio} onChange={handleDiaInicioChange}>
            {[...Array(31).keys()].map((day) => (
              <option key={day + 1} value={day + 1}>{day + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-gray-600">Día Fin</label>
          <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg" value={diaFin} onChange={handleDiaFinChange}>
            {[...Array(31).keys()].map((day) => (
              <option key={day + 1} value={day + 1}>{day + 1}</option>
            ))}
          </select>
        </div>
      </div>
      {renderizarTablasPorEstacion()}
      <div className="mt-6 sm:mt-8">
        {renderizarTotalesPorEstacionYTurno()}
      </div>
    </div>
  );
};

export default Historial_Por_Rangos;