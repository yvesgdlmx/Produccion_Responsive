import { useEffect, useState, useRef } from "react";
import clienteAxios from "../../../config/clienteAxios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import { formatNumber } from "../../helpers/formatNumber";
moment.tz.setDefault("America/Mexico_City");
const Totales_Tallado_Estacion = () => {
  const location = useLocation();
  const talladoRef = useRef(null);
  // Estados para registros, totales y metas
  const [registros, setRegistros] = useState([]);
  const [totalesPorTurno, setTotalesPorTurno] = useState({
    matutino: 0,
    vespertino: 0,
    nocturno: 0,
  });
  const [metasPorHora, setMetasPorHora] = useState({
    matutino: 0,
    vespertino: 0,
    nocturno: 0,
  });
  const [metasTotalesPorTurno, setMetasTotalesPorTurno] = useState({
    matutino: 0,
    vespertino: 0,
    nocturno: 0,
  });
  // Estados para notas por hora
  const [notas, setNotas] = useState({});
  const [notaActiva, setNotaActiva] = useState(null);
  const [editingNota, setEditingNota] = useState("");
  // ***** NUEVO: Estados para las notas de turno *****
  const [notasTurnos, setNotasTurnos] = useState({
    nocturno: null,
    matutino: null,
    vespertino: null,
  });
  const [turnoActivo, setTurnoActivo] = useState(null);
  const [editingTurnoNota, setEditingTurnoNota] = useState("");
  // Arreglo de horas (buckets)
  const ordenTurnos = [
    "21:30", "20:30", "19:30", "18:30", "17:30", "16:30", "15:30", "14:30", // Vespertino
    "13:30", "12:30", "11:30", "10:30", "09:30", "08:30", "07:30", "06:30", // Matutino
    "05:00", "04:00", "03:00", "02:00", "01:00", "00:00", "23:00", "22:00",  // Nocturno
  ];
  const calcularRangoHoras = (hora) => {
    const inicio = hora;
    let fin;
    if (hora === "23:00") {
      fin = "00:00";
    } else {
      const obj = moment(hora, "HH:mm");
      fin = obj.add(1, "hour").format("HH:mm");
    }
    return `${inicio} - ${fin}`;
  };
  // Scroll según hash en la URL
  useEffect(() => {
    if (location.hash === "#tallado" && talladoRef.current) {
      setTimeout(() => {
        const yOffset = -90;
        const element = talladoRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [location]);
  // Obtener datos: metas y registros
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // 1. Obtener metas para tallado desde '/metas/metas-tallados'
        const responseMetas = await clienteAxios("/metas/metas-tallados");
        const registrosMetas = responseMetas.data.registros;
        const globalMeta = registrosMetas.find(item =>
          item.name.toLowerCase() === "global"
        );
        const metaNocturnoBase = globalMeta ? globalMeta.meta_nocturno : 0;
        const metaMatutinoBase = globalMeta ? globalMeta.meta_matutino : 0;
        const metaVespertinoBase = globalMeta ? globalMeta.meta_vespertino : 0;
        setMetasPorHora({
          nocturno: metaNocturnoBase,
          matutino: metaMatutinoBase,
          vespertino: metaVespertinoBase,
        });
        setMetasTotalesPorTurno({
          nocturno: metaNocturnoBase * 8,
          matutino: metaMatutinoBase * 8,
          vespertino: metaVespertinoBase * 7,
        });
        // 2. Obtener registros (hits) del día actual desde '/tallado/tallado/actualdia'
        const responseRegistros = await clienteAxios("/tallado/tallado/actualdia");
        const registrosAPI = responseRegistros.data.registros;
        const ahora = moment();
        let inicioJornada = moment().startOf("day").add(22, "hours");
        let finJornada = moment(inicioJornada).add(1, "days").subtract(30, "minutes");
        if (ahora.isBefore(inicioJornada)) {
          inicioJornada.subtract(1, "day");
          finJornada.subtract(1, "day");
        }
        const registrosFiltrados = registrosAPI.filter((registro) => {
          const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, "YYYY-MM-DD HH:mm:ss");
          return fechaHoraRegistro.isBetween(inicioJornada, finJornada, null, "[)");
        });
        setRegistros(registrosFiltrados);
        calcularTotalesPorTurno(registrosFiltrados, inicioJornada);
        // Cargar las notas por hora → sección "tallado"
        cargarNotas();
        // ***** NUEVO: Cargar las notas de turno para sección "tallado" *****
        cargarNotasTurnos();
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    obtenerDatos();
  }, []);
  // Cargar notas por hora (para tallado)
  const cargarNotas = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const response = await clienteAxios.get("/notas/notas", {
        params: { seccion: "tallado", fecha: today },
      });
      const notasMap = {};
      if (Array.isArray(response.data)) {
        response.data.forEach((item) => {
          notasMap[item.hora] = { id: item.id, nota: item.nota };
        });
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
      }
      setNotas(notasMap);
    } catch (error) {
      console.error("Error al cargar las notas:", error);
    }
  };
  // ***** NUEVO: Función para cargar las notas de turno para tallado *****
  const cargarNotasTurnos = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const response = await clienteAxios.get("/notas/notas_turnos", {
        params: { seccion: "tallado", fecha: today },
      });
      const notasTurnosMap = { nocturno: null, matutino: null, vespertino: null };
      if (Array.isArray(response.data)) {
        response.data.forEach((item) => {
          notasTurnosMap[item.turno] = { id: item.id, comentario: item.comentario };
        });
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
      }
      setNotasTurnos(notasTurnosMap);
    } catch (error) {
      console.error("Error al cargar las notas de turno:", error);
    }
  };
  // Función para calcular los totales por turno
  const calcularTotalesPorTurno = (registros, inicioJornada) => {
    const totales = { matutino: 0, vespertino: 0, nocturno: 0 };
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, "YYYY-MM-DD HH:mm:ss");
      if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone(),
          inicioJornada.clone().add(8, "hours"),
          null,
          "[)"
        )
      ) {
        totales.nocturno += registro.hits;
      } else if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone().add(8, "hours").add(30, "minutes"),
          inicioJornada.clone().add(16, "hours"),
          null,
          "[)"
        )
      ) {
        totales.matutino += registro.hits;
      } else if (
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
  // Función para agrupar hits por hora
  const agruparHitsPorHora = () => {
    const hits = {};
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, "YYYY-MM-DD HH:mm:ss");
      const horaFormateada = fechaHoraRegistro.format("HH:mm");
      if (hits[horaFormateada]) {
        hits[horaFormateada] += registro.hits;
      } else {
        hits[horaFormateada] = registro.hits;
      }
    });
    return hits;
  };
  const hitsPorHora = agruparHitsPorHora();
  const getBucketMoment = (horaStr, inicioJornada) => {
    const [h, m] = horaStr.split(":").map(Number);
    let bucket = inicioJornada.clone().set({ hour: h, minute: m, second: 0, millisecond: 0 });
    if (h < 22) {
      bucket.add(1, "day");
    }
    return bucket;
  };
  const getDisplayValue = (horaStr) => {
    if (hitsPorHora[horaStr] !== undefined) return hitsPorHora[horaStr];
    const ahora = moment();
    let inicioJornada = moment().startOf("day").add(22, "hours");
    if (ahora.isBefore(inicioJornada)) {
      inicioJornada.subtract(1, "day");
    }
    const bucketInicio = getBucketMoment(horaStr, inicioJornada);
    const bucketFin = bucketInicio.clone().add(1, "hour");
    const margen = 5;
    return ahora.isAfter(bucketFin.clone().add(margen, "minutes")) ? 0 : "";
  };
  // Construcción de columnas (buckets) a mostrar
  const columnas = ordenTurnos
    .map((hora) => ({
      hora,
      rango: calcularRangoHoras(hora),
      valor: getDisplayValue(hora),
    }))
    .filter((col) => col.valor !== "");
  const getClassName = (hits, meta) =>
    parseInt(hits, 10) >= meta ? "text-green-500" : "text-red-500";
  let inicioJornada = moment().startOf("day").add(22, "hours");
  if (moment().isBefore(inicioJornada)) {
    inicioJornada.subtract(1, "day");
  }
  const getMetaParaHora = (horaStr, inicioJornada) => {
    const bucketMoment = getBucketMoment(horaStr, inicioJornada);
    if (
      bucketMoment.isBetween(
        inicioJornada.clone(),
        inicioJornada.clone().add(8, "hours"),
        null,
        "[)"
      )
    ) {
      return metasPorHora.nocturno;
    } else if (
      bucketMoment.isBetween(
        inicioJornada.clone().add(8, "hours").add(30, "minutes"),
        inicioJornada.clone().add(16, "hours"),
        null,
        "[)"
      )
    ) {
      return metasPorHora.matutino;
    } else if (
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
  // Función para mostrar/ocultar el recuadro de nota por hora.
  const toggleNota = (hora) => {
    if (notaActiva === hora) {
      setNotaActiva(null);
    } else {
      setNotaActiva(hora);
      setEditingNota(notas[hora]?.nota || "");
    }
  };
  // ***** NUEVO: Función para mostrar/ocultar el recuadro de nota de turno *****
  const toggleNotaTurno = (turno) => {
    if (turnoActivo === turno) {
      setTurnoActivo(null);
    } else {
      setTurnoActivo(turno);
      setEditingTurnoNota(notasTurnos[turno]?.comentario || "");
    }
  };
  // Funciones para guardar y editar nota por hora
  const handleGuardarNota = async (hora) => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const payload = { fecha: today, hora, seccion: "tallado", nota: editingNota };
      const response = await clienteAxios.post("/notas/notas", payload);
      setNotas((prev) => ({ ...prev, [hora]: { id: response.data.id, nota: response.data.nota } }));
      setNotaActiva(null);
    } catch (error) {
      console.error("Error al guardar la nota:", error);
    }
  };
  const handleEditarNota = async (hora) => {
    try {
      const notaActual = notas[hora];
      if (!notaActual || !notaActual.id) {
        console.error("No se encontró la nota con id para la hora:", hora);
        return;
      }
      const payload = { id: notaActual.id, nota: editingNota };
      const response = await clienteAxios.put("/notas/notas", payload);
      setNotas((prev) => ({ ...prev, [hora]: { id: response.data.id, nota: response.data.nota } }));
      setNotaActiva(null);
    } catch (error) {
      console.error("Error al editar la nota:", error);
    }
  };
  // ***** NUEVO: Funciones para guardar y editar la nota de turno *****
  const handleGuardarNotaTurno = async (turno) => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const payload = {
        fecha: today,
        turno, // "nocturno", "matutino" o "vespertino"
        seccion: "tallado",
        comentario: editingTurnoNota,
      };
      const response = await clienteAxios.post("/notas/notas_turnos", payload);
      setNotasTurnos((prev) => ({
        ...prev,
        [turno]: { id: response.data.id, comentario: response.data.comentario },
      }));
      setTurnoActivo(null);
    } catch (error) {
      console.error("Error al guardar la nota de turno:", error);
    }
  };
  const handleEditarNotaTurno = async (turno) => {
    try {
      const notaActual = notasTurnos[turno];
      if (!notaActual || !notaActual.id) {
        console.error("No se encontró la nota para el turno:", turno);
        return;
      }
      const payload = { id: notaActual.id, comentario: editingTurnoNota };
      const response = await clienteAxios.put("/notas/notas_turnos", payload);
      setNotasTurnos((prev) => ({
        ...prev,
        [turno]: { id: response.data.id, comentario: response.data.comentario },
      }));
      setTurnoActivo(null);
    } catch (error) {
      console.error("Error al editar la nota de turno:", error);
    }
  };
  return (
    <div className="max-w-screen-xl rounded-lg">
      {/* Versión para pantallas grandes */}
      <div className="hidden lg:block" ref={talladoRef}>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-500 text-white border-l-2">
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
              <td className="py-3">
                <Link to={"/totales_tallado_maquina"} className="link__tabla">
                  <div className="flex items-center justify-center hover:scale-105 transition-transform duration-300 px-4">
                    <img src="./img/ver.png" alt="" width={25} className="relative left-2" />
                    <div className="py-3 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base">
                      Bloq. tallado
                    </div>
                  </div>
                </Link>
              </td>
              {columnas.map((col, i) => {
                const metaParaCol = getMetaParaHora(col.hora, inicioJornada);
                return (
                  <td
                    key={i}
                    title={
                      notas[col.hora] && notas[col.hora].nota
                        ? notas[col.hora].nota
                        : "Haz click para agregar un comentario"
                    }
                    className="py-3 px-4 border-b font-bold border-l-2 border-gray-200 min-w-[150px] whitespace-nowrap text-sm md:text-base bg-white relative cursor-pointer"
                    onClick={() => toggleNota(col.hora)}
                  >
                    <span className={getClassName(col.valor, metaParaCol)}>
                      {col.valor}
                    </span>
                    {notaActiva === col.hora && (
                      <div
                        className="absolute top-[-10px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          className="w-full h-16 p-1 border mb-2 text-xs"
                          value={editingNota}
                          onChange={(e) => setEditingNota(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            disabled={!!notas[col.hora]?.nota}
                            className={`py-1 px-3 rounded text-xs ${
                              notas[col.hora]?.nota
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            onClick={(e) => {
                              if (!notas[col.hora]?.nota) {
                                e.stopPropagation();
                                handleGuardarNota(col.hora);
                              }
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarNota(col.hora);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotaActiva(null);
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        {/* Totales por turno (Desktop) */}
        <div className="flex flex-col md:flex-row justify-around mt-4 font-semibold mb-4 gap-6">
          {["nocturno", "matutino", "vespertino"].map((turno) => (
            <div
              key={turno}
              className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center relative cursor-pointer"
              title={
                notasTurnos[turno] && notasTurnos[turno].comentario
                  ? notasTurnos[turno].comentario
                  : "Haz click para agregar un comentario"
              }
              onClick={() => toggleNotaTurno(turno)}
            >
              <p className="text-gray-600 text-sm md:text-base">
                {turno === "nocturno" && "Total Nocturno: "}
                {turno === "matutino" && "Total Matutino: "}
                {turno === "vespertino" && "Total Vespertino: "}
                <span className={getClassName(totalesPorTurno[turno], metasTotalesPorTurno[turno]) + " ml-1 font-bold"}>
                  {formatNumber(totalesPorTurno[turno])}
                </span>{" "}
                / Meta Acumulada: {formatNumber(metasTotalesPorTurno[turno])} / Meta x Hora: {metasPorHora[turno]}
              </p>
              {turnoActivo === turno && (
                <div
                  className="absolute top-[-55px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {notasTurnos[turno] ? (
                    <p>{notasTurnos[turno].comentario}</p>
                  ) : (
                    <p>Agregar un comentario</p>
                  )}
                  <textarea
                    className="w-full h-16 p-1 border mb-2 text-xs"
                    value={editingTurnoNota}
                    onChange={(e) => setEditingTurnoNota(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex justify-end space-x-2">
                    {notasTurnos[turno] ? (
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarNotaTurno(turno);
                        }}
                      >
                        Editar
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGuardarNotaTurno(turno);
                        }}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurnoActivo(null);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Versión para pantallas pequeñas y medianas */}
      <div className="block lg:hidden mt-4">
        <div className="bg-white shadow-md rounded-lg mb-4 p-6">
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold text-gray-700">Nombre:</span>
            <span className="font-bold text-gray-700">Bloq. tallado</span>
          </div>
          <div className="py-4">
            <span className="font-bold text-gray-700">Horas:</span>
            {columnas.map((col, i) => {
              const metaParaCol = getMetaParaHora(col.hora, inicioJornada);
              return (
                <div key={i} className={`flex flex-col py-2 px-4 ${i % 2 === 0 ? "bg-slate-200" : "bg-slate-300"}`}>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    title={
                      notas[col.hora] && notas[col.hora].nota
                        ? notas[col.hora].nota
                        : "Haz click para agregar un comentario"
                    }
                    onClick={() => toggleNota(col.hora)}
                  >
                    <span className="font-bold text-gray-700">{col.rango}:</span>
                    <span className={`font-bold ${parseInt(col.valor, 10) >= metaParaCol ? "text-green-500" : "text-red-500"}`}>
                      {col.valor}
                    </span>
                  </div>
                  {notaActiva === col.hora && (
                    <div className="mt-2 bg-gray-100 p-2 rounded shadow-md" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="w-full h-16 p-1 border mb-2 text-xs"
                        value={editingNota}
                        onChange={(e) => setEditingNota(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          disabled={!!notas[col.hora]?.nota}
                          className={`py-1 px-3 rounded text-xs ${
                            notas[col.hora]?.nota
                              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          onClick={(e) => {
                            if (!notas[col.hora]?.nota) {
                              e.stopPropagation();
                              handleGuardarNota(col.hora);
                            }
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarNota(col.hora);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotaActiva(null);
                          }}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <Link to={"/totales_tallado_maquina"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
              <button className="text-white font-bold uppercase">Ver Detalles</button>
            </Link>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="bg-green-50 p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-green-700 mb-2">Totales por Turno</h4>
              <div className="grid grid-cols-1 gap-4">
                {["nocturno", "matutino", "vespertino"].map((turno) => (
                  <div
                    key={turno}
                    className="relative cursor-pointer"
                    title={
                      notasTurnos[turno] && notasTurnos[turno].comentario
                        ? notasTurnos[turno].comentario
                        : "Haz click para agregar un comentario"
                    }
                    onClick={() => toggleNotaTurno(turno)}
                  >
                    <p className="text-gray-600 text-sm md:text-base">
                      {turno === "nocturno" && "Total Nocturno: "}
                      {turno === "matutino" && "Total Matutino: "}
                      {turno === "vespertino" && "Total Vespertino: "}
                      <span className={getClassName(totalesPorTurno[turno], metasTotalesPorTurno[turno]) + " ml-1 font-bold"}>
                        {formatNumber(totalesPorTurno[turno])}
                      </span>{" "}
                      / Meta Acumulada: {formatNumber(metasTotalesPorTurno[turno])} / Meta x Hora: {metasPorHora[turno]}
                    </p>
                    {turnoActivo === turno && (
                      <div
                        className="absolute z-[999] -top-12 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notasTurnos[turno] ? (
                          <p>{notasTurnos[turno].comentario}</p>
                        ) : (
                          <p>Agregar un comentario</p>
                        )}
                        <textarea
                          className="w-full h-12 p-1 border mb-2 text-xs"
                          value={editingTurnoNota}
                          onChange={(e) => setEditingTurnoNota(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex justify-end space-x-2">
                          {notasTurnos[turno] ? (
                            <button
                              className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarNotaTurno(turno);
                              }}
                            >
                              Editar
                            </button>
                          ) : (
                            <button
                              className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGuardarNotaTurno(turno);
                              }}
                            >
                              Guardar
                            </button>
                          )}
                          <button
                            className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTurnoActivo(null);
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Totales_Tallado_Estacion;