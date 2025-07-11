import { useEffect, useState, useRef } from "react";
import clienteAxios from "../../../config/clienteAxios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment-timezone";
moment.tz.setDefault("America/Mexico_City");
import { formatNumber } from "../../helpers/formatNumber";
const Totales_Desbloqueo_Estacion = () => {
  const location = useLocation();
  const desbloqueoRef = useRef(null);
  // Estados para los registros (hits)
  const [registros, setRegistros] = useState([]);
  // Estados para la meta por hora y la meta acumulada por turno
  const [metasPorHora, setMetasPorHora] = useState({
    nocturno: 0,
    matutino: 0,
    vespertino: 0,
  });
  const [metasTotalesPorTurno, setMetasTotalesPorTurno] = useState({
    nocturno: 0,
    matutino: 0,
    vespertino: 0,
  });
  // Estado para los totales de hits por turno
  const [totalesPorTurno, setTotalesPorTurno] = useState({
    nocturno: 0,
    matutino: 0,
    vespertino: 0,
  });
  // Arreglo fijo de buckets (horas) en el orden deseado
  const ordenTurnos = [
    "21:30", "20:30", "19:30", "18:30", "17:30", "16:30", "15:30", "14:30", // Vespertino
    "13:30", "12:30", "11:30", "10:30", "09:30", "08:30", "07:30", "06:30", // Matutino
    "05:00", "04:00", "03:00", "02:00", "01:00", "00:00", "23:00", "22:00"  // Nocturno
  ];
  // Efecto para hacer scroll si el hash es "#desbloqueo"
  useEffect(() => {
    if (location.hash === "#desbloqueo" && desbloqueoRef.current) {
      setTimeout(() => {
        const yOffset = -100;
        const element = desbloqueoRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [location]);
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Consultar las metas y filtrar solo las correspondientes a "DEBLOCKING"
        const responseMetas = await clienteAxios("/metas/metas-manuales");
        const registrosMetas = responseMetas.data.registros.filter(registro =>
          registro.name.includes("DEBLOCKING")
        );
        let sumaNocturno = 0;
        let sumaMatutino = 0;
        let sumaVespertino = 0;
        registrosMetas.forEach((item) => {
          sumaNocturno += item.meta_nocturno;
          sumaMatutino += item.meta_matutino;
          sumaVespertino += item.meta_vespertino;
        });
        // Establecer la meta por hora para cada turno
        setMetasPorHora({
          nocturno: sumaNocturno,
          matutino: sumaMatutino,
          vespertino: sumaVespertino,
        });
        // Calcular las metas acumuladas según la cantidad de horas de cada turno
        setMetasTotalesPorTurno({
          nocturno: sumaNocturno * 8,    // Nocturno: 8 horas
          matutino: sumaMatutino * 8,    // Matutino: 8 horas
          vespertino: sumaVespertino * 7 // Vespertino: 7 horas
        });
        // Obtener los registros (hits) del día actual para DEBLOCKING
        const responseRegistros = await clienteAxios("/manual/manual/actualdia");
        const registrosDesblocking = responseRegistros.data.registros.filter(registro =>
          registro.name.includes("DEBLOCKING")
        );
        const ahora = moment();
        // La jornada inicia a las 22:00 del día anterior y finaliza a las 21:30 del día siguiente
        let inicioJornada = moment().startOf("day").add(22, "hours");
        let finJornada = moment(inicioJornada).add(1, "days").subtract(30, "minutes");
        if (ahora.isBefore(inicioJornada)) {
          inicioJornada.subtract(1, "day");
          finJornada.subtract(1, "day");
        }
        const registrosFiltrados = registrosDesblocking.filter((registro) => {
          const fechaHoraRegistro = moment(
            `${registro.fecha} ${registro.hour}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          return fechaHoraRegistro.isBetween(inicioJornada, finJornada, null, "[)");
        });
        setRegistros(registrosFiltrados);
        calcularTotalesPorTurno(registrosFiltrados, inicioJornada);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    obtenerDatos();
  }, []);
  // Función para calcular totales de hits por turno
  const calcularTotalesPorTurno = (registros, inicioJornada) => {
    const totales = {
      nocturno: 0,
      matutino: 0,
      vespertino: 0,
    };
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(
        `${registro.fecha} ${registro.hour}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      // Turno Nocturno: de inicioJornada hasta inicioJornada + 8 horas
      if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone(),
          inicioJornada.clone().add(8, "hours"),
          null,
          "[)"
        )
      ) {
        totales.nocturno += registro.hits;
      }
      // Turno Matutino: de inicioJornada + 8h 30min hasta inicioJornada + 16h
      else if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone().add(8, "hours").add(30, "minutes"),
          inicioJornada.clone().add(16, "hours"),
          null,
          "[)"
        )
      ) {
        totales.matutino += registro.hits;
      }
      // Turno Vespertino: de inicioJornada + 16h 30min hasta inicioJornada + 23h 30min
      else if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone().add(16, "hours").add(30, "minutes"),
          inicioJornada.clone().add(23, "hours").add(30, "minutes"),
          null,
          "[)"
        )
      ) {
        totales.vespertino += registro.hits;
      }
    });
    setTotalesPorTurno(totales);
  };
  // Función para agrupar hits por hora (bucket)
  const agruparHitsPorHora = () => {
    const hits = {};
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(
        `${registro.fecha} ${registro.hour}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const horaFormateada = fechaHoraRegistro.format("HH:mm");
      hits[horaFormateada] = (hits[horaFormateada] || 0) + registro.hits;
    });
    return hits;
  };
  const hitsPorHora = agruparHitsPorHora();
  // Función para calcular el rango de cada bucket (1 hora)
  const calcularRangoHoras = (hora) => {
    let fin;
    if (hora === "23:00") {
      fin = "00:00";
    } else {
      fin = moment(hora, "HH:mm").add(1, "hour").format("HH:mm");
    }
    return `${hora} - ${fin}`;
  };
  // Función para obtener el objeto moment correspondiente al inicio del bucket
  const getBucketMoment = (horaStr, inicioJornada) => {
    const [h, m] = horaStr.split(":").map(Number);
    let bucket = inicioJornada
      .clone()
      .set({ hour: h, minute: m, second: 0, millisecond: 0 });
    // Si la hora es menor a 22, se asume que pertenece al día siguiente
    if (h < 22) {
      bucket.add(1, "day");
    }
    return bucket;
  };
  /*  
    Función que devuelve el valor a mostrar para cada bucket:
      - Si existe valor en hitsPorHora para ese bucket, se muestra.
      - Si no existe, se verifica si el bucket ya debió haber cerrado (margen de 5 minutos).
          • Si ya cerró, se retorna 0.
          • Si no, se retorna cadena vacía para no mostrar esa columna.
  */
  const getDisplayValue = (horaStr) => {
    if (hitsPorHora[horaStr] !== undefined) return hitsPorHora[horaStr];
    const ahora = moment();
    let inicioJornada = moment().startOf("day").add(22, "hours");
    if (ahora.isBefore(inicioJornada)) {
      inicioJornada.subtract(1, "day");
    }
    const bucketInicio = getBucketMoment(horaStr, inicioJornada);
    const bucketFin = bucketInicio.clone().add(1, "hour");
    const margen = 5; // minutos de margen
    return ahora.isAfter(bucketFin.clone().add(margen, "minutes")) ? 0 : "";
  };
  // Función para determinar, dado un bucket (hora) y el inicio de la jornada,
  // cuál es la meta por hora asociada al turno correspondiente.
  const getMetaParaHora = (horaStr, inicioJornada) => {
    const bucketMoment = getBucketMoment(horaStr, inicioJornada);
    // Turno Nocturno: de inicioJornada hasta inicioJornada + 8 horas
    if (
      bucketMoment.isBetween(
        inicioJornada.clone(),
        inicioJornada.clone().add(8, "hours"),
        null,
        "[)"
      )
    ) {
      return metasPorHora.nocturno;
    }
    // Turno Matutino: de inicioJornada + 8h 30min hasta inicioJornada + 16h
    else if (
      bucketMoment.isBetween(
        inicioJornada.clone().add(8, "hours").add(30, "minutes"),
        inicioJornada.clone().add(16, "hours"),
        null,
        "[)"
      )
    ) {
      return metasPorHora.matutino;
    }
    // Turno Vespertino: de inicioJornada + 16h 30min hasta inicioJornada + 23h 30min
    else if (
      bucketMoment.isBetween(
        inicioJornada.clone().add(16, "hours").add(30, "minutes"),
        inicioJornada.clone().add(23, "hours").add(30, "minutes"),
        null,
        "[)"
      )
    ) {
      return metasPorHora.vespertino;
    }
    return 0;
  };
  // Se arma el arreglo de columnas (buckets) a partir del arreglo fijo de horas
  const columnas = ordenTurnos
    .map((hora) => ({
      hora,
      rango: calcularRangoHoras(hora),
      valor: getDisplayValue(hora),
    }))
    .filter((col) => col.valor !== "");
  // Función para asignar una clase en función de si se cumple la meta.
  // En las celdas de la tabla se compara la meta POR HORA (para ese bucket),
  // mientras que en los totales se comparará con la META ACUMULADA.
  const getClassName = (valor, meta) =>
    valor >= meta ? "text-green-500" : "text-red-500";
  // Determinamos el inicio de la jornada para uso global en el componente
  let inicioJornada = moment().startOf("day").add(22, "hours");
  if (moment().isBefore(inicioJornada)) inicioJornada.subtract(1, "day");
  return (
    <div className="max-w-screen-xl rounded-lg">
      {/* Versión para pantallas grandes */}
      <div className="hidden lg:block" ref={desbloqueoRef}>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-500 text-white border-l-2">
              {/* En el encabezado dejamos la primera celda vacía para no mostrar "Desbloqueo" aquí */}
              <th className="py-3 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base"></th>
              {columnas.map((col, i) => (
                <th
                  key={i}
                  className="py-3 px-4 border-b min-w-[150px] whitespace-nowrap text-sm md:text-base"
                >
                  {col.rango}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            <tr className="font-semibold text-gray-700">
              {/* Celda inicial con el nombre junto al icono de "ver" */}
              <td className="py-3">
                <Link to={"/totales_desblocking_maquina"} className="link__tabla">
                  <div className="flex items-center justify-center hover:scale-105 transition-transform duration-300 px-4">
                    <img
                      src="./img/ver.png"
                      alt="ver detalles"
                      width={25}
                      className="relative left-2"
                    />
                    <div className="py-3 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base">
                      Desbloqueo
                    </div>
                  </div>
                </Link>
              </td>
              {columnas.map((col, i) => {
                // Se compara la cantidad de hits del bucket contra la meta POR HORA del turno para esa hora
                const metaCol = getMetaParaHora(col.hora, inicioJornada);
                return (
                  <td
                    key={i}
                    className="py-3 px-4 border-b font-bold border-l-2 border-gray-200 min-w-[150px] whitespace-nowrap text-sm md:text-base bg-white"
                  >
                    <span className={getClassName(col.valor, metaCol)}>
                      {col.valor}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        {/* Totales por turno para versión Desktop */}
        <div className="flex flex-col md:flex-row justify-around mt-4 font-semibold mb-4 gap-6">
          <div className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center">
            <p className="text-gray-600 text-sm md:text-base">
              Total Nocturno:{" "}
              <span className={getClassName(totalesPorTurno.nocturno, metasTotalesPorTurno.nocturno) + " ml-1 font-bold"}>
                {formatNumber(totalesPorTurno.nocturno)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.nocturno)} / Meta x Hora: {metasPorHora.nocturno}
            </p>
          </div>
          <div className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center">
            <p className="text-gray-600 text-sm md:text-base">
              Total Matutino:{" "}
              <span className={getClassName(totalesPorTurno.matutino, metasTotalesPorTurno.matutino) + " ml-1 font-bold"}>
                {formatNumber(totalesPorTurno.matutino)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.matutino)} / Meta x Hora: {metasPorHora.matutino}
            </p>
          </div>
          <div className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center">
            <p className="text-gray-600 text-sm md:text-base">
              Total Vespertino:{" "}
              <span className={getClassName(totalesPorTurno.vespertino, metasTotalesPorTurno.vespertino) + " ml-1 font-bold"}>
                {formatNumber(totalesPorTurno.vespertino)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.vespertino)} / Meta x Hora: {metasPorHora.vespertino}
            </p>
          </div>
        </div>
      </div>
      {/* Versión para pantallas pequeñas y medianas */}
      <div className="block lg:hidden mt-4">
        <div className="bg-white shadow-md rounded-lg mb-4 p-6">
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold text-gray-700">Nombre:</span>
            <span className="font-bold text-gray-700">Desbloqueo</span>
          </div>
          <div className="py-4">
            <span className="font-bold text-gray-700">Horas:</span>
            {columnas.map((col, idx) => {
              const metaCol = getMetaParaHora(col.hora, inicioJornada);
              return (
                <div key={idx} className={`flex justify-between py-2 px-4 ${idx % 2 === 0 ? "bg-slate-200" : "bg-slate-300"}`}>
                  <span className="font-bold text-gray-700">{col.rango}:</span>
                  <span className={`font-bold ${parseInt(col.valor, 10) >= metaCol ? "text-green-500" : "text-red-500"}`}>
                    {col.valor}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <Link
              to={"/totales_desblocking_maquina"}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              <button className="text-white font-bold uppercase">Ver Detalles</button>
            </Link>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="bg-green-50 p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-green-700 mb-2">Totales por Turno</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <span className="block text-gray-600">Nocturno: </span>
                  <span className={`font-semibold text-md ${getClassName(totalesPorTurno.nocturno, metasTotalesPorTurno.nocturno)}`}>
                    {formatNumber(totalesPorTurno.nocturno)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.nocturno)} / Meta x Hora: {metasPorHora.nocturno}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-600">Matutino: </span>
                  <span className={`font-semibold text-md ${getClassName(totalesPorTurno.matutino, metasTotalesPorTurno.matutino)}`}>
                    {formatNumber(totalesPorTurno.matutino)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.matutino)} / Meta x Hora: {metasPorHora.matutino}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-600">Vespertino: </span>
                  <span className={`text-md font-semibold ${getClassName(totalesPorTurno.vespertino, metasTotalesPorTurno.vespertino)}`}>
                    {formatNumber(totalesPorTurno.vespertino)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.vespertino)} / Meta x Hora: {metasPorHora.vespertino}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Totales_Desbloqueo_Estacion;