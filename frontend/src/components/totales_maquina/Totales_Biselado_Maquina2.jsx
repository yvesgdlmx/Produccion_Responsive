import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import Heading from "../others/Heading";
import clienteAxios from "../../../config/clienteAxios";
import TablaSurtidoMaquina from "../others/tables/TablaSurtidoMaquina";
import AreaSelect from "../others/html_personalizado/AreaSelect";
import { seccionesOrdenadas } from "../../../utilidades/SeccionesOrdenadas";
// Función para extraer el nombre base (separa por guion) y agrupar estaciones
const extractBaseName = (name) => name.split("-")[0].trim();
// Función que suma una hora a un string con formato "HH:MM"
const addOneHour = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const nextHour = (hours + 1) % 24;
  return String(nextHour).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
};
// Función getTurnWithTime para diferenciar los turnos:
// Se considera nocturno si la hora es ≥22 o <6; entre 06:30 y 14:30 es matutino; el resto es vespertino.
const getTurnWithTime = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  if (h >= 22 || h < 6) {
    return "meta_nocturno";
  }
  const totalMin = h * 60 + m;
  if (totalMin >= 390 && totalMin < 870) return "meta_matutino";
  return "meta_vespertino";
};
// Generador de columnas para el turno matutino (06:30 a 14:30)
const generateMatutinoColumns = () => {
  const cols = [];
  for (let hour = 6; hour < 14; hour++) {
    const startStr = String(hour).padStart(2, "0") + ":30";
    const nextHour = (hour + 1) % 24;
    const header = `${startStr} - ${String(nextHour).padStart(2, "0")}:30`;
    cols.push({ header, accessor: `hour_${startStr}` });
  }
  return cols;
};
// Generador de columnas para el turno vespertino (14:30 a 22:30)
const generateVespertinoColumns = () => {
  const cols = [];
  for (let hour = 14; hour < 22; hour++) {
    const startStr = String(hour).padStart(2, "0") + ":30";
    const nextHour = (hour + 1) % 24;
    const header = `${startStr} - ${String(nextHour).padStart(2, "0")}:30`;
    cols.push({ header, accessor: `hour_${startStr}` });
  }
  return cols;
};
// Generador de columnas para el turno nocturno (22:00 a 06:00)
// Se generan columnas para las horas: 22, 23, 0, 1, 2, 3, 4, 5.
const generateNocturnoColumns = () => {
  const cols = [];
  const hours = [22, 23, 0, 1, 2, 3, 4, 5];
  for (let h of hours) {
    const startStr = String(h).padStart(2, "0") + ":00";
    const header = `${startStr} - ${addOneHour(startStr)}`;
    cols.push({ header, accessor: `hour_${startStr}` });
  }
  return cols;
};
const Totales_Biselado_Maquina2 = () => {
  const [tableData, setTableData] = useState([]);
  const [metasMapping, setMetasMapping] = useState({});
  // Columnas fijas (Nombre y Total acumulado)
  const fixedColumns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Total acumulado", accessor: "totalAcumulado" }
  ];
  // Generar e invertir las columnas de cada turno para mostrarlas de derecha a izquierda.
  const matutinoColumns = generateMatutinoColumns().reverse();
  const vespertinoColumns = generateVespertinoColumns().reverse();
  const nocturnoColumns = generateNocturnoColumns().reverse();
  // Reordenar las columnas para que, de derecha a izquierda,
  // aparezca primero el turno nocturno, luego el matutino y por último el vespertino.
  const hourColumns = [...vespertinoColumns, ...matutinoColumns, ...nocturnoColumns];
  // Filtrar intervalos ya cumplidos.
  const currentTime = moment();
  const filteredHourColumns = hourColumns.filter((col) => {
    if (!col.accessor.startsWith("hour_")) return true;
    const startStr = col.accessor.replace("hour_", "");
    const [h, m] = startStr.split(":").map(Number);
    const turno = getTurnWithTime(startStr);
    let intervalEnd;
    if (turno === "meta_nocturno") {
      if (h >= 22) {
        intervalEnd = moment()
          .subtract(1, "day")
          .set({ hour: h, minute: m, second: 0, millisecond: 0 })
          .add(1, "hour");
      } else {
        intervalEnd = moment()
          .set({ hour: h, minute: m, second: 0, millisecond: 0 })
          .add(1, "hour");
      }
    } else {
      intervalEnd = moment()
        .set({ hour: h, minute: m, second: 0, millisecond: 0 })
        .add(1, "hour");
    }
    return currentTime.isSameOrAfter(intervalEnd);
  });
  
  // Combinar columnas fijas con las filtradas
  const allColumns = [...fixedColumns, ...filteredHourColumns];
  const hourAccessors = filteredHourColumns.map((col) => col.accessor);
  // Obtener las metas de biselados desde el endpoint correspondiente
  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const response = await clienteAxios.get("/metas/metas-biselados");
        const registrosMetas = response.data.registros || [];
        const mapping = {};
        registrosMetas.forEach((reg) => {
          mapping[reg.name] = {
            meta_nocturno: reg.meta_nocturno,
            meta_matutino: reg.meta_matutino,
            meta_vespertino: reg.meta_vespertino
          };
        });
        setMetasMapping(mapping);
      } catch (error) {
        console.error("Error al obtener las metas de biselados:", error);
      }
    };
    fetchMetas();
  }, []);
  const biseladoSection = seccionesOrdenadas.find((seccion) => seccion.seccion === "Biselado");
  // Obtener y agrupar registros desde el endpoint "/biselado/biselado/actualdia"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get("/biselado/biselado/actualdia");
        const registros = response.data.registros || [];
        const currentDateStr = moment(new Date()).format("YYYY-MM-DD");
        const yesterdayDateStr = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
        // Filtrar registros según la fecha y hora
        const registrosFiltrados = registros.filter((reg) => {
          if (reg.fecha === currentDateStr) return true;
          if (reg.fecha === yesterdayDateStr && reg.hour.slice(0, 5) >= "22:00") return true;
          return false;
        });
        // Agrupar registros por la máquina (usando el nombre base)
        const agrupados = {};
        registrosFiltrados.forEach((reg) => {
          const baseName = extractBaseName(reg.name);
          if (!agrupados[baseName]) {
            agrupados[baseName] = { nombre: baseName, totalAcumulado: 0 };
          }
          agrupados[baseName].totalAcumulado += Number(reg.hits);
          const key = `hour_${reg.hour.slice(0, 5)}`;
          agrupados[baseName][key] = (agrupados[baseName][key] || 0) + Number(reg.hits);
        });
        // Convierte el objeto agrupado en un array
        const dataAgrupada = Object.values(agrupados);
        // Lista de máquinas de la zona (las que deseas mostrar, incluso sin registros)
        const maquinasArea = biseladoSection ? biseladoSection.nombres : [];
        // Se hace una búsqueda case-insensitive para verificar si ya existe el registro.
        const dataConMaquinasFijas = maquinasArea.map((maquina) => {
          const registroExistente = dataAgrupada.find(
            (reg) => reg.nombre.toLowerCase() === maquina.toLowerCase()
          );
          if (registroExistente) {
            return registroExistente;
          } else {
            const nuevoRegistro = { nombre: maquina, totalAcumulado: 0 };
            hourAccessors.forEach((key) => {
              nuevoRegistro[key] = 0;
            });
            return nuevoRegistro;
          }
        });
        setTableData(dataConMaquinasFijas);
      } catch (error) {
        console.error("Error al consultar la API de biselados:", error);
      }
    };
    fetchData();
  }, []);
  // Función para calcular la meta acumulada según cada columna (según turno)
  const computeMetaAcumulada = (metas, columnKeys) => {
    return columnKeys.reduce((total, key) => {
      const timeStr = key.replace("hour_", "");
      const turno = getTurnWithTime(timeStr);
      return total + Number(metas[turno] || 0);
    }, 0);
  };
  // Construir datos finales inyectando "metas" y "metaAcumulada"
  const finalFilteredData = useMemo(() => {
    return tableData.map((row) => {
      const metas = metasMapping[row.nombre] || {};
      const metaAcumulada = Object.keys(metas).length > 0 
         ? computeMetaAcumulada(metas, hourAccessors)
         : "";
      return { ...row, metaAcumulada, metas };
    });
  }, [tableData, metasMapping, hourAccessors]);
  // Calcular fila de totales por columna
  const totalsRow = useMemo(() => {
    return allColumns.reduce((acc, col) => {
      if (col.accessor === "nombre") {
        acc[col.accessor] = "Totales";
      } else {
        acc[col.accessor] = finalFilteredData.reduce((sum, row) => {
          return sum + Number(row[col.accessor] || 0);
        }, 0);
      }
      return acc;
    }, {});
  }, [allColumns, finalFilteredData]);
  return (
    <div className="p-4">
      <Heading title="Resumen Biselado" />
      <AreaSelect />
      <TablaSurtidoMaquina 
        columns={allColumns} 
        finalFilteredData={finalFilteredData} 
        totalsRow={totalsRow} 
      />
    </div>
  );
};
export default Totales_Biselado_Maquina2;