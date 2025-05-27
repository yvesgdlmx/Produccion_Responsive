import React, { useEffect, useState } from "react";
import clienteAxios from "../../../../config/clienteAxios";
import TablaGenerica from "../../others/TablaGenerica";
import { formatDecimal } from "../../../helpers/formatDecimal";
import { formatNumber } from "../../../helpers/formatNumber";
import Alerta from "../../others/alertas/Alerta";
const HistorialInk = ({ startYear, startMonth, startDay, endYear, endMonth, endDay }) => {
  const [registros, setRegistros] = useState([]);
  // Helper para agregar cero a la izquierda
  const formatNum = (num) => (num < 10 ? `0${num}` : num);
  // Formateamos las fechas en formato YYYY-MM-DD
  const fechaInicio = `${startYear}-${formatNum(startMonth)}-${formatNum(startDay)}`;
  const fechaFin = `${endYear}-${formatNum(endMonth)}-${formatNum(endDay)}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get(
          `/reportes/facturacion-ink/rango/${fechaInicio}/${fechaFin}`
        );
        console.log("Registros Ink obtenidos:", response.data.registros);
        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error al obtener los registros Ink:", error);
      }
    };
    fetchData();
  }, [fechaInicio, fechaFin]);
  // Agrupar los registros por ShipDate y calcular las columnas necesarias
  const grouped = registros.reduce((acc, registro) => {
    const fecha = registro.ShipDate;
    // Cálculos de cada registro:
    // Se toman LensPrice, CoatingsPrice y TintPrice y se calcula el "tallado" restando Coatings y Tint
    const lensPrice = parseFloat(registro.LensPrice) || 0;
    const coatingsPrice = parseFloat(registro.CoatingsPrice) || 0;
    const tintPriceIndividual = parseFloat(registro.TintPrice) || 0;
    const talladoRegistro = lensPrice - coatingsPrice - tintPriceIndividual;
    // Para "trabajos tint" se cuenta sólo si TintOrdered es 1
    const tintOrdered = parseInt(registro.TintOrdered, 10) === 1 ? 1 : 0;
    const tintPrice = tintPriceIndividual;
    if (!acc[fecha]) {
      acc[fecha] = {
        semana: registro.semana,
        fecha: fecha,
        trabajosTallados: 1,
        tallado: talladoRegistro,
        trabajosAR: registro.ARCoating !== null ? 1 : 0,
        ar: registro.ARCoating !== null ? (parseFloat(registro.CoatingsPrice) || 0) : 0,
        trabajosTint: tintOrdered,
        tint: tintPrice,
        total: lensPrice
      };
    } else {
      acc[fecha].trabajosTallados += 1;
      acc[fecha].tallado += talladoRegistro;
      if (registro.ARCoating !== null) {
        acc[fecha].trabajosAR = (acc[fecha].trabajosAR || 0) + 1;
        acc[fecha].ar += (parseFloat(registro.CoatingsPrice) || 0);
      }
      acc[fecha].trabajosTint += tintOrdered;
      acc[fecha].tint += tintPrice;
      acc[fecha].total += lensPrice;
    }
    return acc;
  }, {});
  // Convertir el objeto agrupado a array (sin formatear los números aún)
  const dataRaw = Object.values(grouped);
  // Formatear los valores numéricos para la tabla (en cada grupo)
  const formattedData = dataRaw.map((item) => ({
    ...item,
    tallado: formatDecimal(item.tallado),
    ar: formatDecimal(item.ar),
    tint: formatDecimal(item.tint),
    total: formatDecimal(item.total)
  }));
  // Calcular totales generales para todas las filas (usando dataRaw para obtener los valores numéricos)
  const totalsRaw = dataRaw.reduce(
    (acum, item) => ({
      trabajosTallados: acum.trabajosTallados + item.trabajosTallados,
      tallado: acum.tallado + item.tallado,
      trabajosAR: acum.trabajosAR + (item.trabajosAR || 0),
      ar: acum.ar + item.ar,
      trabajosTint: acum.trabajosTint + item.trabajosTint,
      tint: acum.tint + item.tint,
      total: acum.total + item.total
    }),
    { trabajosTallados: 0, tallado: 0, trabajosAR: 0, ar: 0, trabajosTint: 0, tint: 0, total: 0 }
  );
  const totalsRow = {
    semana: "",
    fecha: "Totales",
    trabajosTallados: totalsRaw.trabajosTallados,
    tallado: formatDecimal(totalsRaw.tallado),
    trabajosAR: totalsRaw.trabajosAR,
    ar: formatDecimal(totalsRaw.ar),
    trabajosTint: totalsRaw.trabajosTint,
    tint: formatDecimal(totalsRaw.tint),
    total: formatDecimal(totalsRaw.total)
  };
  // Definir las columnas para la tabla
  const columns = [
    { header: "Semana", accessor: "semana" },
    { header: "Fecha", accessor: "fecha" },
    { header: "Trabajos tallados", accessor: "trabajosTallados" },
    { header: "$ Tallado", accessor: "tallado" },
    { header: "Trabajos AR", accessor: "trabajosAR" },
    { header: "$ AR", accessor: "ar" },
    { header: "Trabajos tint", accessor: "trabajosTint" },
    { header: "$ tint", accessor: "tint" },
    { header: "$ Total", accessor: "total" }
  ];
  return (
    <div className="mb-8">
      {formattedData.length > 0 ? (
        <>
          <h2 className="text-center mb-4 uppercase font-semibold text-2xl text-gray-500">Ink</h2>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <TablaGenerica columns={columns} data={formattedData} totalesRow={totalsRow} />
          </div>
        </>
      ) : (
         <Alerta message="No se encontraron registros para el rango seleccionado." type="error" />
      )}
    </div>
  );
};
export default HistorialInk;