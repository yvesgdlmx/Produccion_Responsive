import { useEffect, useState, useRef } from "react"; 
import clienteAxios from "../../../config/clienteAxios"; 
import { Link, useLocation } from "react-router-dom"; 
import moment from "moment-timezone"; 
import { formatNumber } from "../../helpers/formatNumber"; 
moment.tz.setDefault("America/Mexico_City"); 
const Totales_Armado_Estacion = () => { 
  const location = useLocation(); 
  const produccionRef = useRef(null); 
  // Estados para los registros (hits) 
  const [registros, setRegistros] = useState([]); 
  // Estados para las metas por turno: meta por hora y meta acumulada 
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
  // Estados para los totales de hits por turno 
  const [totalesPorTurno, setTotalesPorTurno] = useState({ 
    matutino: 0, 
    vespertino: 0, 
    nocturno: 0, 
  }); 
  // Estados para la funcionalidad de notas 
  // "notas" es un objeto donde cada clave es la hora y su valor es { id, nota } 
  const [notas, setNotas] = useState({}); 
  // "notaActiva" almacena la hora del bucket en el que se hizo clic para mostrar el recuadro 
  const [notaActiva, setNotaActiva] = useState(null); 
  // "editingNota" almacena el texto que se va a escribir/editar en la nota 
  const [editingNota, setEditingNota] = useState(""); 
  // Arreglo fijo de buckets (horas) en el orden deseado 
  const ordenTurnos = [ 
    "21:30", "20:30", "19:30", "18:30", "17:30", "16:30", "15:30", "14:30", // Vespertino 
    "13:30", "12:30", "11:30", "10:30", "09:30", "08:30", "07:30", "06:30", // Matutino 
    "05:00", "04:00", "03:00", "02:00", "01:00", "00:00", "23:00", "22:00"  // Nocturno 
  ]; 
  // Efecto para hacer scroll si existe hash en la URL 
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
  // Función para calcular el rango de horas de cada bucket (dura 1 hora) 
  const calcularRangoHoras = (horaInicio) => { 
    const inicio = moment(horaInicio, "HH:mm"); 
    const fin = moment(horaInicio, "HH:mm").add(1, "hour"); 
    return `${inicio.format("HH:mm")} - ${fin.format("HH:mm")}`; 
  }; 
  // Obtener datos: metas y registros (hits) 
  useEffect(() => { 
    const obtenerDatos = async () => { 
      try { 
        // 1. Obtener meta manual para JOB COMPLETE desde "/metas/metas-manuales"
        // Se busca el registro global, en lugar de sumar todas las metas de los registros individuales. 
        // En este ejemplo se asume que el registro global tiene un name tal que al pasarlo a minúsculas sea "global job complete".
        const responseMetas = await clienteAxios("/metas/metas-manuales"); 
        const registrosMetas = responseMetas.data.registros; 
        const globalMeta = registrosMetas.find(item => 
          item.name.toLowerCase() === "global armado" 
        ); 
        
        // En caso de no encontrar el registro global se establece 0 como valor por defecto. 
        const metaNocturnoBase = globalMeta ? globalMeta.meta_nocturno : 0; 
        const metaMatutinoBase = globalMeta ? globalMeta.meta_matutino : 0; 
        const metaVespertinoBase = globalMeta ? globalMeta.meta_vespertino : 0; 
        setMetasPorHora({ 
          nocturno: metaNocturnoBase, 
          matutino: metaMatutinoBase, 
          vespertino: metaVespertinoBase, 
        }); 
        // Calcular metas acumuladas: 
        // Nocturno: 8 horas; Matutino: 8 horas; Vespertino: 7 horas 
        setMetasTotalesPorTurno({ 
          nocturno: metaNocturnoBase * 8, 
          matutino: metaMatutinoBase * 8, 
          vespertino: metaVespertinoBase * 7, 
        }); 
        // 2. Obtener registros (hits) del día actual para JOB COMPLETE 
        const responseRegistros = await clienteAxios("/manual/manual/actualdia"); 
        // Se filtra por registros que contengan "JOB COMPLETE" en el name 
        const registrosLensLog = responseRegistros.data.registros.filter((registro) => 
          registro.name.includes("ARMADO") 
        ); 
        const ahora = moment(); 
        let inicioHoy = moment().startOf("day").add(22, "hours"); // 22:00 del día anterior 
        let finHoy = moment(inicioHoy).add(1, "days").subtract(30, "minutes"); // 21:30 del día siguiente 
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
        
        // Cargar las notas para la sección "produccion" 
        cargarNotas(); 
      } catch (error) { 
        console.error("Error al obtener los datos:", error); 
      } 
    }; 
    obtenerDatos(); 
  }, []); 
  // Calcular totales de hits por turno usando la lógica de la jornada 
  const calcularTotalesPorTurno = (registros, inicioJornada) => { 
    const totales = { nocturno: 0, matutino: 0, vespertino: 0 }; 
    registros.forEach((registro) => { 
      const fechaHoraRegistro = moment( 
        `${registro.fecha} ${registro.hour}`, 
        "YYYY-MM-DD HH:mm:ss" 
      ); 
      // Turno Nocturno: de inicioJornada a inicioJornada + 8 horas 
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
      // Turno Matutino: de inicioJornada + 8 horas 30 min hasta inicioJornada + 16 horas 
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
      // Turno Vespertino: de inicioJornada + 16 horas 30 min hasta inicioJornada + 23 horas 30 min 
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
  // Función para agrupar los hits por hora (bucket) 
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
  // Función para obtener el instante del bucket (el inicio) a partir de un string "HH:mm" 
  const getBucketMoment = (horaStr, inicioJornada) => { 
    const [h, m] = horaStr.split(":").map(Number); 
    let bucket = inicioJornada 
      .clone() 
      .set({ hour: h, minute: m, second: 0, millisecond: 0 }); 
    // Si la hora es menor a 22, se considera que pertenece al siguiente día 
    if (h < 22) { 
      bucket.add(1, "day"); 
    } 
    return bucket; 
  }; 
  /* 
    Función que devuelve el valor a mostrar para cada bucket: 
    - Si existe un valor registrado en hitsPorHora se retorna. 
    - Si no existe, se revisa si el bucket ya debió haber cerrado (con margen de 5 minutos) 
      y en ese caso se retorna 0; de lo contrario se retorna "". 
  */ 
  const getDisplayValue = (horaStr) => { 
    if (hitsPorHora[horaStr] !== undefined) 
      return hitsPorHora[horaStr]; 
    const ahora = moment(); 
    let inicioJornada = moment().startOf("day").add(22, "hours"); 
    if (ahora.isBefore(inicioJornada)) { 
      inicioJornada.subtract(1, "days"); 
    } 
    const bucketInicio = getBucketMoment(horaStr, inicioJornada); 
    const bucketFin = bucketInicio.clone().add(1, "hour"); 
    const margen = 5; // minutos de margen 
    return ahora.isAfter(bucketFin.clone().add(margen, "minutes")) 
      ? 0 
      : ""; 
  }; 
  // Construir columnas a partir del arreglo fijo, filtrando buckets sin valor 
  const columnas = ordenTurnos 
    .map((hora) => ({ 
      hora, 
      rango: calcularRangoHoras(hora), 
      valor: getDisplayValue(hora), 
    })) 
    .filter((col) => col.valor !== ""); 
  // Función para asignar la clase según se cumpla la meta 
  const getClassName = (hits, meta) => 
    hits >= meta ? "text-green-500" : "text-red-500"; 
  // Definir el inicio de la jornada (uso global) 
  let inicioJornada = moment().startOf("day").add(22, "hours"); 
  if (moment().isBefore(inicioJornada)) inicioJornada.subtract(1, "day"); 
  // Función que dada una hora (bucket) retorna la meta por hora según el turno 
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
    ) 
      return metasPorHora.nocturno; 
    // Turno Matutino: de inicioJornada + 8h 30min hasta inicioJornada + 16h 
    else if ( 
      bucketMoment.isBetween( 
        inicioJornada.clone().add(8, "hours").add(30, "minutes"), 
        inicioJornada.clone().add(16, "hours"), 
        null, 
        "[)" 
      ) 
    ) 
      return metasPorHora.matutino; 
    // Turno Vespertino: de inicioJornada + 16h 30min hasta inicioJornada + 23h 30min 
    else if ( 
      bucketMoment.isBetween( 
        inicioJornada.clone().add(16, "hours").add(30, "minutes"), 
        inicioJornada.clone().add(23, "hours").add(30, "minutes"), 
        null, 
        "[)" 
      ) 
    ) 
      return metasPorHora.vespertino; 
    return 0; 
  }; 
  // –––––––––––––––––– FUNCIONALIDAD DE NOTAS –––––––––––––––––– 
  // Mostrar/ocultar el recuadro de nota al hacer clic en un bucket (celda) 
  const toggleNota = (hora) => { 
    if (notaActiva === hora) { 
      setNotaActiva(null); 
    } else { 
      setNotaActiva(hora); 
      setEditingNota(notas[hora]?.nota || ""); 
    } 
  }; 
  // Función para guardar la nota (POST) usando la sección "produccion" 
  const handleGuardarNota = async (hora) => { 
    try { 
      const today = moment().format("YYYY-MM-DD"); 
      const payload = { 
        fecha: today, 
        hora, 
        seccion: "produccion", 
        nota: editingNota, 
      }; 
      const response = await clienteAxios.post("/notas/notas", payload); 
      setNotas((prev) => ({ 
        ...prev, 
        [hora]: { id: response.data.id, nota: response.data.nota }, 
      })); 
      setNotaActiva(null); 
    } catch (error) { 
      console.error("Error al guardar la nota:", error); 
    } 
  }; 
  // Función para editar la nota (PUT) usando el id de la nota existente 
  const handleEditarNota = async (hora) => { 
    try { 
      const notaActual = notas[hora]; 
      if (!notaActual || !notaActual.id) { 
        console.error("No se encontró la nota con id para la hora:", hora); 
        return; 
      } 
      const payload = { 
        id: notaActual.id, 
        nota: editingNota, 
      }; 
      const response = await clienteAxios.put("/notas/notas", payload); 
      setNotas((prev) => ({ 
        ...prev, 
        [hora]: { id: response.data.id, nota: response.data.nota }, 
      })); 
      setNotaActiva(null); 
    } catch (error) { 
      console.error("Error al editar la nota:", error); 
    } 
  }; 
  // Función para cargar las notas (GET) de la sección "produccion" para el día actual 
  const cargarNotas = async () => { 
    try { 
      const today = moment().format("YYYY-MM-DD"); 
      const response = await clienteAxios.get("/notas/notas", { 
        params: { seccion: "produccion", fecha: today }, 
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
  // –––––––––––––––––– RENDERIZACIÓN DEL COMPONENTE –––––––––––––––––– 
  return ( 
    <div className="max-w-screen-xl rounded-lg"> 
      {/* Versión para pantallas grandes */} 
      <div className="hidden lg:block" ref={produccionRef}> 
        <table className="min-w-full bg-white border"> 
          <thead> 
            <tr className="bg-blue-500 text-white border-l-2"> 
              {/* Primera columna: enlace con ícono y título "Producción" */} 
              <th className="py-2 px-4 min-w-[150px] whitespace-nowrap text-sm md:text-base"></th> 
              {columnas.map((col, i) => ( 
                <th 
                  key={i} 
                  className="py-2 px-4 border-b min-w-[150px] whitespace-nowrap text-sm md:text-base" 
                > 
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
                      Armado 
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
                    onClick={() => toggleNota(col.hora)} 
                  > 
                    <span className={getClassName(col.valor, metaCol)}> 
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
      {/* Diseño tipo card para pantallas pequeñas/medianas */} 
      <div className="block lg:hidden mt-4"> 
        <div className="bg-white shadow-md rounded-lg mb-4 p-6"> 
          <div className="flex justify-between border-b pb-2"> 
            <span className="font-bold text-gray-700">Nombre:</span> 
            <span className="font-bold text-gray-700">Armado</span> 
          </div> 
          <div className="py-4"> 
            <span className="font-bold text-gray-700">Horas:</span> 
            {columnas.map((col, idx) => { 
              const metaCol = getMetaParaHora(col.hora, inicioJornada); 
              return ( 
                <div 
                  key={idx} 
                  className={`flex flex-col py-2 px-4 ${ 
                    idx % 2 === 0 ? "bg-slate-200" : "bg-slate-300" 
                  }`} 
                > 
                  {/* Fila principal: muestra el rango y el valor. Al hacer clic se activa el panel de notas */} 
                  <div 
                    className="flex justify-between items-center cursor-pointer" 
                    onClick={() => toggleNota(col.hora)} 
                  > 
                    <span className="font-bold text-gray-700">{col.rango}:</span> 
                    <span 
                      className={`font-bold ${ 
                        parseInt(col.valor, 10) >= metaCol 
                          ? "text-green-500" 
                          : "text-red-500" 
                      }`} 
                    > 
                      {col.valor} 
                    </span> 
                  </div> 
                  {/* Panel de notas: se inserta en el flujo y empuja hacia abajo el contenido */} 
                  {notaActiva === col.hora && ( 
                    <div 
                      className="mt-2 bg-gray-100 p-4 border rounded shadow-md w-full text-xs" 
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
                </div> 
              ); 
            })} 
          </div> 
          <div className="flex justify-center mt-4"> 
            <Link 
              to={"/totales_produccion_maquina"} 
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700" 
            > 
              <button className="text-white font-bold uppercase"> 
                Ver Detalles 
              </button> 
            </Link> 
          </div> 
          <div className="mt-6 border-t pt-4"> 
            <div className="bg-green-50 p-4 rounded-lg shadow-md"> 
              <h4 className="font-semibold text-green-700 mb-2"> 
                Totales por Turno 
              </h4> 
              <div className="grid grid-cols-1 gap-4"> 
                <div> 
                  <p className="text-gray-600 text-sm md:text-base"> 
                    Total Nocturno:{" "} 
                    <span 
                      className={ 
                        getClassName(totalesPorTurno.nocturno, metasTotalesPorTurno.nocturno) + " font-bold" 
                      } 
                    > 
                      {formatNumber(totalesPorTurno.nocturno)} 
                    </span>{" "} 
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.nocturno)}{" "} 
                    / Meta x Hora: {metasPorHora.nocturno} 
                  </p> 
                </div> 
                <div> 
                  <p className="text-gray-600 text-sm md:text-base"> 
                    Total Matutino:{" "} 
                    <span 
                      className={ 
                        getClassName(totalesPorTurno.matutino, metasTotalesPorTurno.matutino) + " font-bold" 
                      } 
                    > 
                      {formatNumber(totalesPorTurno.matutino)} 
                    </span>{" "} 
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.matutino)}{" "} 
                    / Meta x Hora: {metasPorHora.matutino} 
                  </p> 
                </div> 
                <div> 
                  <p className="text-gray-600 text-sm md:text-base"> 
                    Total Vespertino:{" "} 
                    <span 
                      className={ 
                        getClassName(totalesPorTurno.vespertino, metasTotalesPorTurno.vespertino) + " font-bold" 
                      } 
                    > 
                      {formatNumber(totalesPorTurno.vespertino)} 
                    </span>{" "} 
                    / Meta Acumulada: {formatNumber(metasTotalesPorTurno.vespertino)}{" "} 
                    / Meta x Hora: {metasPorHora.vespertino} 
                  </p> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
export default Totales_Armado_Estacion;