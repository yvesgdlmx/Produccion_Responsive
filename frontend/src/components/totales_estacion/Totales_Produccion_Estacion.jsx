import { useEffect, useState, useRef } from "react";
import clienteAxios from "../../../config/clienteAxios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import { formatNumber } from "../../helpers/formatNumber";
moment.tz.setDefault("America/Mexico_City");
const Totales_Produccion_Estacion = () => {
  const location = useLocation();
  const produccionRef = useRef(null);
  // Estados para registros, metas y totales
  const [registros, setRegistros] = useState([]);
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
  const [totalesPorTurno, setTotalesPorTurno] = useState({
    nocturno: 0,
    matutino: 0,
    vespertino: 0,
  });
  // Estados para notas por hora (ya existentes)
  const [notas, setNotas] = useState({});
  const [notaActiva, setNotaActiva] = useState(null);
  const [editingNota, setEditingNota] = useState("");
  // NUEVO: Estados para notas de turno
  const [notasTurnos, setNotasTurnos] = useState({
    nocturno: null,
    matutino: null,
    vespertino: null,
  });
  const [turnoActivo, setTurnoActivo] = useState(null);
  const [editingTurnoNota, setEditingTurnoNota] = useState("");
  
  // Arreglo fijo de buckets en el orden deseado
  const ordenTurnos = [
    "21:30", "20:30", "19:30", "18:30", "17:30", "16:30", "15:30", "14:30", // Vespertino
    "13:30", "12:30", "11:30", "10:30", "09:30", "08:30", "07:30", "06:30", // Matutino
    "05:00", "04:00", "03:00", "02:00", "01:00", "00:00", "23:00", "22:00"  // Nocturno
  ];
  
  // Efecto para realizar scroll si la URL trae hash
  useEffect(() => {
    if (location.hash === "#produccion" && produccionRef.current) {
      setTimeout(() => {
        const yOffset = -5;
        const element = produccionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [location]);
  
  // Función para calcular el rango de horas (cada bucket dura 1 hora)
  const calcularRangoHoras = (horaInicio) => {
    const inicio = moment(horaInicio, "HH:mm");
    const fin = moment(horaInicio, "HH:mm").add(1, "hour");
    return `${inicio.format("HH:mm")} - ${fin.format("HH:mm")}`;
  };
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // 1. Obtener metas para producción (buscando el registro global "global produccion")
        const responseMetas = await clienteAxios("/metas/metas-manuales");
        const registrosMetas = responseMetas.data.registros;
        const globalMeta = registrosMetas.find(item =>
          item.name.toLowerCase() === "global produccion"
        );
        const metaNocturnoBase = globalMeta ? globalMeta.meta_nocturno : 0;
        const metaMatutinoBase = globalMeta ? globalMeta.meta_matutino : 0;
        const metaVespertinoBase = globalMeta ? globalMeta.meta_vespertino : 0;
        setMetasPorHora({
          nocturno: metaNocturnoBase,
          matutino: metaMatutinoBase,
          vespertino: metaVespertinoBase,
        });
        // Se asume multiplicación similar para totales:
        setMetasTotalesPorTurno({
          nocturno: metaNocturnoBase * 8,
          matutino: metaMatutinoBase * 8,
          vespertino: metaVespertinoBase * 7,
        });
        
        // 2. Obtener registros (hits) para JOB COMPLETE
        const responseRegistros = await clienteAxios("/manual/manual/actualdia");
        const registrosLensLog = responseRegistros.data.registros.filter((registro) =>
          registro.name.includes("JOB COMPLETE")
        );
        const ahora = moment();
        let inicioHoy = moment().startOf("day").add(22, "hours");
        let finHoy = moment(inicioHoy).add(1, "days").subtract(30, "minutes");
        if (ahora.isBefore(inicioHoy)) {
          inicioHoy.subtract(1, "days");
          finHoy.subtract(1, "days");
        }
        const registrosFiltrados = registrosLensLog.filter((registro) => {
          const fechaHoraRegistro = moment(
            `${registro.fecha} ${registro.hour}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          return fechaHoraRegistro.isBetween(inicioHoy, finHoy, null, "[)");
        });
        setRegistros(registrosFiltrados);
        calcularTotalesPorTurno(registrosFiltrados, inicioHoy);
        // Cargar las notas para producción (notas por hora)
        cargarNotas();
        // Cargar las notas de turno para producción
        cargarNotasTurnos();
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    obtenerDatos();
  }, []);
  
  // Función para calcular totales de hits por turno usando la lógica de la jornada
  const calcularTotalesPorTurno = (registros, inicioJornada) => {
    const totales = { nocturno: 0, matutino: 0, vespertino: 0 };
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, "YYYY-MM-DD HH:mm:ss");
      if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone(),
          inicioJornada.clone().add(8, "hours"),
          null, "[)"
        )
      ) {
        totales.nocturno += registro.hits;
      } else if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone().add(8, "hours").add(30, "minutes"),
          inicioJornada.clone().add(16, "hours"),
          null, "[)"
        )
      ) {
        totales.matutino += registro.hits;
      } else if (
        fechaHoraRegistro.isBetween(
          inicioJornada.clone().add(16, "hours").add(30, "minutes"),
          inicioJornada.clone().add(23, "hours").add(30, "minutes"),
          null, "[)"
        )
      ) {
        totales.vespertino += registro.hits;
      }
    });
    setTotalesPorTurno(totales);
  };
  
  // Agrupar hits por hora para construir la tabla
  const agruparHitsPorHora = () => {
    const hits = {};
    registros.forEach((registro) => {
      const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, "YYYY-MM-DD HH:mm:ss");
      const horaFormateada = fechaHoraRegistro.format("HH:mm");
      hits[horaFormateada] = (hits[horaFormateada] || 0) + registro.hits;
    });
    return hits;
  };
  
  const hitsPorHora = agruparHitsPorHora();
  
  // Para cada bucket se obtiene el instante inicial; si la hora es menor a 22 se suma un día
  const getBucketMoment = (horaStr, inicioJornada) => {
    const [h, m] = horaStr.split(":").map(Number);
    let bucket = inicioJornada.clone().set({ hour: h, minute: m, second: 0, millisecond: 0 });
    if (h < 22) bucket.add(1, "day");
    return bucket;
  };
  
  // Valor a mostrar para cada bucket: si ya debió cerrarse regresa 0; de lo contrario, cadena vacía
  const getDisplayValue = (horaStr) => {
    if (hitsPorHora[horaStr] !== undefined) return hitsPorHora[horaStr];
    const ahora = moment();
    let inicio = moment().startOf("day").add(22, "hours");
    if (ahora.isBefore(inicio)) inicio.subtract(1, "days");
    const bucketInicio = getBucketMoment(horaStr, inicio);
    const bucketFin = bucketInicio.clone().add(1, "hour");
    const margen = 5;
    return ahora.isAfter(bucketFin.clone().add(margen, "minutes")) ? 0 : "";
  };
  
  const columnas = ordenTurnos
    .map((hora) => ({
      hora,
      rango: calcularRangoHoras(hora),
      valor: getDisplayValue(hora),
    }))
    .filter((col) => col.valor !== "");
  
  const getClassName = (hits, meta) =>
    parseInt(hits, 10) >= meta ? "text-green-500" : "text-red-500";
  
  // Asignar la meta por hora según el bucket
  const getMetaParaHora = (horaStr, inicioJornada) => {
    const bucketMoment = getBucketMoment(horaStr, inicioJornada);
    if (
      bucketMoment.isBetween(
        inicioJornada.clone(),
        inicioJornada.clone().add(8, "hours"),
        null, "[)"
      )
    )
      return metasPorHora.nocturno;
    else if (
      bucketMoment.isBetween(
        inicioJornada.clone().add(8, "hours").add(30, "minutes"),
        inicioJornada.clone().add(16, "hours"),
        null, "[)"
      )
    )
      return metasPorHora.matutino;
    else if (
      bucketMoment.isBetween(
        inicioJornada.clone().add(16, "hours").add(30, "minutes"),
        inicioJornada.clone().add(23, "hours").add(30, "minutes"),
        null, "[)"
      )
    )
      return metasPorHora.vespertino;
    return 0;
  };
  
  // —–– FUNCIONALIDAD PARA NOTAS POR HORA —––
  const toggleNota = (hora) => {
    if (notaActiva === hora) {
      setNotaActiva(null);
    } else {
      setNotaActiva(hora);
      setEditingNota(notas[hora]?.nota || "");
    }
  };
  
  const handleGuardarNota = async (hora) => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const payload = { fecha: today, hora, seccion: "produccion", nota: editingNota };
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
  
  const cargarNotas = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const response = await clienteAxios.get("/notas/notas", { params: { seccion: "produccion", fecha: today } });
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
  
  // —–– NUEVA FUNCIONALIDAD: Notas de Turno —––
  const cargarNotasTurnos = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const response = await clienteAxios.get("/notas/notas_turnos", {
        params: { seccion: "produccion", fecha: today },
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
  
  const toggleNotaTurno = (turno) => {
    if (turnoActivo === turno) {
      setTurnoActivo(null);
    } else {
      setTurnoActivo(turno);
      setEditingTurnoNota(notasTurnos[turno]?.comentario || "");
    }
  };
  
  const handleGuardarNotaTurno = async (turno) => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const payload = { fecha: today, turno, seccion: "produccion", comentario: editingTurnoNota };
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
  
  // Definir el inicio de la jornada
  let inicioJornada = moment().startOf("day").add(22, "hours");
  if (moment().isBefore(inicioJornada)) inicioJornada.subtract(1, "day");
  
  return (
    <div className="max-w-screen-xl rounded-lg">
      {/* Versión para pantallas grandes */}
      <div className="hidden lg:block" ref={produccionRef}>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-500 text-white border-l-2">
              <th className="py-2 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base"></th>
              {columnas.map((col, i) => (
                <th key={i} className="py-2 px-4 border-b min-w-[150px] whitespace-nowrap text-sm md:text-base">
                  {col.rango}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            <tr className="font-semibold text-gray-700">
              <td className="py-2">
                <Link to={"/totales_produccion_maquina"} className="link__tabla">
                  <div className="flex items-center justify-center hover:scale-105 transition-transform duration-300 px-4">
                    <img src="./img/ver.png" alt="" width={25} className="relative left-2" />
                    <div className="py-4 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base">
                      Producción
                    </div>
                  </div>
                </Link>
              </td>
              {columnas.map((col, i) => {
                const metaCol = getMetaParaHora(col.hora, inicioJornada);
                return (
                  <td
                    key={i}
                    className="py-2 px-4 border-b font-bold border-l-2 border-gray-200 min-w-[150px] whitespace-nowrap text-sm md:text-base bg-white relative cursor-pointer"
                    title={
                      // Si ya existe una nota, se muestra; de lo contrario, se muestra mensaje por defecto.
                      notas[col.hora] && notas[col.hora].nota
                        ? notas[col.hora].nota
                        : "Haz click para agregar un comentario"
                    }
                    onClick={() => toggleNota(col.hora)}
                  >
                    <span className={getClassName(col.valor, metaCol)}>
                      {col.valor}
                    </span>
                    {notaActiva === col.hora && (
                      <div className="absolute top-[-10px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                           onClick={(e) => e.stopPropagation()}>
                        <textarea
                          className="w-full h-16 p-1 border mb-2 text-xs"
                          value={editingNota}
                          onChange={(e) => setEditingNota(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            disabled={!!notas[col.hora]?.nota}
                            className={`py-1 px-3 rounded text-xs ${notas[col.hora]?.nota ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
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
        {/* Sección de Totales por Turno con funcionalidad de notas */}
        <div className="flex flex-row justify-around mt-4 font-semibold mb-4 gap-6">
          {/* Tarjeta para Total Nocturno */}
          <div
            className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center relative cursor-pointer"
            title={
              notasTurnos.nocturno && notasTurnos.nocturno.comentario
                ? notasTurnos.nocturno.comentario
                : "Haz click para agregar un comentario"
            }
            onClick={() => toggleNotaTurno("nocturno")}
          >
            <p className="text-gray-600 text-sm md:text-base">
              Total Nocturno:{" "}
              <span className={getClassName(totalesPorTurno.nocturno, metasTotalesPorTurno.nocturno)}>
                {formatNumber(totalesPorTurno.nocturno)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.nocturno)} / Meta x Hora: {metasPorHora.nocturno}
            </p>
            {turnoActivo === "nocturno" && (
              <div className="absolute top-[-55px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                   onClick={(e) => e.stopPropagation()}>
                {notasTurnos.nocturno ? (
                  <p>{notasTurnos.nocturno.comentario}</p>
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
                  {notasTurnos.nocturno ? (
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarNotaTurno("nocturno");
                      }}
                    >
                      Editar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGuardarNotaTurno("nocturno");
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
          {/* Tarjeta para Total Matutino */}
          <div
            className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center relative cursor-pointer"
            title={
              notasTurnos.matutino && notasTurnos.matutino.comentario
                ? notasTurnos.matutino.comentario
                : "Haz click para agregar un comentario"
            }
            onClick={() => toggleNotaTurno("matutino")}
          >
            <p className="text-gray-600 text-sm md:text-base">
              Total Matutino:{" "}
              <span className={getClassName(totalesPorTurno.matutino, metasTotalesPorTurno.matutino)}>
                {formatNumber(totalesPorTurno.matutino)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.matutino)} / Meta x Hora: {metasPorHora.matutino}
            </p>
            {turnoActivo === "matutino" && (
              <div className="absolute top-[-55px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                   onClick={(e) => e.stopPropagation()}>
                {notasTurnos.matutino ? (
                  <p>{notasTurnos.matutino.comentario}</p>
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
                  {notasTurnos.matutino ? (
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarNotaTurno("matutino");
                      }}
                    >
                      Editar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGuardarNotaTurno("matutino");
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
          {/* Tarjeta para Total Vespertino */}
          <div
            className="bg-white p-2 px-10 rounded-lg shadow-md flex items-center relative cursor-pointer"
            title={
              notasTurnos.vespertino && notasTurnos.vespertino.comentario
                ? notasTurnos.vespertino.comentario
                : "Haz click para agregar un comentario"
            }
            onClick={() => toggleNotaTurno("vespertino")}
          >
            <p className="text-gray-600 text-sm md:text-base">
              Total Vespertino:{" "}
              <span className={getClassName(totalesPorTurno.vespertino, metasTotalesPorTurno.vespertino)}>
                {formatNumber(totalesPorTurno.vespertino)}
              </span>{" "}
              / Meta Acumulada: {formatNumber(metasTotalesPorTurno.vespertino)} / Meta x Hora: {metasPorHora.vespertino}
            </p>
            {turnoActivo === "vespertino" && (
              <div className="absolute top-[-55px] left-0 z-50 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs"
                   onClick={(e) => e.stopPropagation()}>
                {notasTurnos.vespertino ? (
                  <p>{notasTurnos.vespertino.comentario}</p>
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
                  {notasTurnos.vespertino ? (
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarNotaTurno("vespertino");
                      }}
                    >
                      Editar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGuardarNotaTurno("vespertino");
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
        </div>
      </div>
      {/* Diseño para pantallas pequeñas */}
      <div className="block lg:hidden mt-4">
        <div className="bg-white shadow-md rounded-lg mb-4 p-6">
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold text-gray-700">Nombre:</span>
            <span className="font-bold text-gray-700">Producción</span>
          </div>
          <div className="py-4">
            <span className="font-bold text-gray-700">Horas:</span>
            {columnas.map((col, idx) => {
              const metaCol = getMetaParaHora(col.hora, inicioJornada);
              return (
                <div key={idx} className={`flex flex-col py-2 px-4 ${idx % 2 === 0 ? "bg-slate-200" : "bg-slate-300"}`}>
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleNota(col.hora)}>
                    <span className="font-bold text-gray-700">{col.rango}:</span>
                    <span className={`font-bold ${parseInt(col.valor, 10) >= metaCol ? "text-green-500" : "text-red-500"}`}>
                      {col.valor}
                    </span>
                  </div>
                  {notaActiva === col.hora && (
                    <div className="mt-2 bg-gray-100 p-4 border rounded shadow-md w-full text-xs" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="w-full h-16 p-1 border mb-2 text-xs"
                        value={editingNota}
                        onChange={(e) => setEditingNota(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          disabled={!!notas[col.hora]?.nota}
                          className={`py-1 px-3 rounded text-xs ${notas[col.hora]?.nota ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
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
            <Link to={"/totales_produccion_maquina"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
              <button className="text-white font-bold uppercase">Ver Detalles</button>
            </Link>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="bg-green-50 p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-green-700 mb-2">Totales por Turno</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative cursor-pointer" onClick={() => toggleNotaTurno("nocturno")}>
                  <p className="text-gray-600 text-sm md:text-base">
                    Total Nocturno:{" "}
                    <span className={getClassName(totalesPorTurno.nocturno, metasTotalesPorTurno.nocturno) + " font-bold"}>
                      {formatNumber(totalesPorTurno.nocturno)}
                    </span>{" "}
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.nocturno)} / Meta x Hora: {metasPorHora.nocturno}
                  </p>
                  {turnoActivo === "nocturno" && (
                    <div className="absolute z-[999] -top-12 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs" onClick={(e) => e.stopPropagation()}>
                      {notasTurnos.nocturno ? (
                        <p>{notasTurnos.nocturno.comentario}</p>
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
                        {notasTurnos.nocturno ? (
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarNotaTurno("nocturno");
                            }}
                          >
                            Editar
                          </button>
                        ) : (
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGuardarNotaTurno("nocturno");
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
                <div className="relative cursor-pointer" onClick={() => toggleNotaTurno("matutino")}>
                  <p className="text-gray-600 text-sm md:text-base">
                    Total Matutino:{" "}
                    <span className={getClassName(totalesPorTurno.matutino, metasTotalesPorTurno.matutino) + " font-bold"}>
                      {formatNumber(totalesPorTurno.matutino)}
                    </span>{" "}
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.matutino)} / Meta x Hora: {metasPorHora.matutino}
                  </p>
                  {turnoActivo === "matutino" && (
                    <div className="absolute z-[999] -top-12 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs" onClick={(e) => e.stopPropagation()}>
                      {notasTurnos.matutino ? (
                        <p>{notasTurnos.matutino.comentario}</p>
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
                        {notasTurnos.matutino ? (
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarNotaTurno("matutino");
                            }}
                          >
                            Editar
                          </button>
                        ) : (
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGuardarNotaTurno("matutino");
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
                <div className="relative cursor-pointer" onClick={() => toggleNotaTurno("vespertino")}>
                  <p className="text-gray-600 text-sm md:text-base">
                    Total Vespertino:{" "}
                    <span className={getClassName(totalesPorTurno.vespertino, metasTotalesPorTurno.vespertino) + " font-bold"}>
                      {formatNumber(totalesPorTurno.vespertino)}
                    </span>{" "}
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.vespertino)} / Meta x Hora: {metasPorHora.vespertino}
                  </p>
                  {turnoActivo === "vespertino" && (
                    <div className="absolute z-[999] -top-12 bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs" onClick={(e) => e.stopPropagation()}>
                      {notasTurnos.vespertino ? (
                        <p>{notasTurnos.vespertino.comentario}</p>
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
                        {notasTurnos.vespertino ? (
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarNotaTurno("vespertino");
                            }}
                          >
                            Editar
                          </button>
                        ) : (
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGuardarNotaTurno("vespertino");
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Totales_Produccion_Estacion;