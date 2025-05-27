import React, { useEffect, useState } from "react";
import clienteAxios from "../../../../config/clienteAxios";
import TablaGenerica from "../../others/TablaGenerica";
import { formatDecimal } from "../../../helpers/formatDecimal";
import { formatNumber } from "../../../helpers/formatNumber";
import Alerta from "../../others/alertas/Alerta";
const HistorialHoya = ({ startYear, startMonth, startDay, endYear, endMonth, endDay }) => {
  const [registros, setRegistros] = useState([]);
  // Función para agregar un cero a la izquierda si el número es menor que 10
  const formatNum = (num) => (num < 10 ? `0${num}` : num);
  // Formatear las fechas en el formato YYYY-MM-DD
  const fechaInicio = `${startYear}-${formatNum(startMonth)}-${formatNum(startDay)}`;
  const fechaFin = `${endYear}-${formatNum(endMonth)}-${formatNum(endDay)}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get(
          `/reportes/facturacion-hoya/rango/${fechaInicio}/${fechaFin}`
        );
        console.log("Registros HOYA obtenidos:", response.data.registros);
        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error al obtener los registros HOYA:", error);
      }
    };
    fetchData();
  }, [fechaInicio, fechaFin]);
  // Mapear cada registro para la tabla
  const data = registros.map((registro) => ({
    semana: registro.semana,
    fecha: registro.fecha,
    trabajosTallados: registro.trabajos_tallados,
    precioTallado: formatDecimal(registro.precio_tallado),
    trabajosHC: registro.trabajos_hc,
    precioHC: formatDecimal(registro.precio_hc),
    trabajosArPremium: registro.trabajos_ar_premium,
    precioArPremium: formatDecimal(registro.precio_ar_premium),
    trabajosArStandard: registro.trabajos_ar_standard,
    precioArStandard: formatDecimal(registro.precio_ar_standard),
    totalPrecio: formatDecimal(registro.total_precio)
  }));
  // Definir las columnas a mostrar
  const columns = [
    { header: "Semana", accessor: "semana" },
    { header: "Fecha", accessor: "fecha" },
    { header: "Trab. Tallados", accessor: "trabajosTallados" },
    { header: "$ Tallado", accessor: "precioTallado" },
    { header: "Trab. HC", accessor: "trabajosHC" },
    { header: "$ HC", accessor: "precioHC" },
    { header: "Trab. AR Premium", accessor: "trabajosArPremium" },
    { header: "$ AR Premium", accessor: "precioArPremium" },
    { header: "Trab. AR Standard", accessor: "trabajosArStandard" },
    { header: "$ AR Standard", accessor: "precioArStandard" },
    { header: "Total Precio", accessor: "totalPrecio" }
  ];
  // Calcular los totales generales a partir de los registros obtenidos
  const totals = registros.reduce(
    (acc, registro) => {
      acc.trabajosTallados += Number(registro.trabajos_tallados);
      acc.precioTallado += parseFloat(registro.precio_tallado);
      acc.trabajosHC += Number(registro.trabajos_hc);
      acc.precioHC += parseFloat(registro.precio_hc);
      acc.trabajosArPremium += Number(registro.trabajos_ar_premium);
      acc.precioArPremium += parseFloat(registro.precio_ar_premium);
      acc.trabajosArStandard += Number(registro.trabajos_ar_standard);
      acc.precioArStandard += parseFloat(registro.precio_ar_standard);
      acc.totalPrecio += parseFloat(registro.total_precio);
      return acc;
    },
    {
      trabajosTallados: 0,
      precioTallado: 0,
      trabajosHC: 0,
      precioHC: 0,
      trabajosArPremium: 0,
      precioArPremium: 0,
      trabajosArStandard: 0,
      precioArStandard: 0,
      totalPrecio: 0
    }
  );
  // Crear el objeto de totales para la fila extra de la tabla
  const totalsRow = {
    semana: "",
    fecha: "Totales",
    trabajosTallados: formatNumber(totals.trabajosTallados),
    precioTallado: formatDecimal(totals.precioTallado),
    trabajosHC: formatNumber(totals.trabajosHC),
    precioHC: formatDecimal(totals.precioHC),
    trabajosArPremium: formatNumber(totals.trabajosArPremium),
    precioArPremium: formatDecimal(totals.precioArPremium),
    trabajosArStandard: formatNumber(totals.trabajosArStandard),
    precioArStandard: formatDecimal(totals.precioArStandard),
    totalPrecio: formatDecimal(totals.totalPrecio)
  };
  return (
    <div className="mb-8">
      {registros.length > 0 ? (
        <>
          <h2 className="text-center mb-4 uppercase font-semibold text-2xl text-gray-500">
            HOYA
          </h2>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <TablaGenerica columns={columns} data={data} totalesRow={totalsRow} />
          </div>
        </>
      ) : (
         <Alerta message="No se encontraron registros para el rango seleccionado." type="error" />
      )}
    </div>
  );
};
export default HistorialHoya;