import React, { useEffect, useState } from "react";
import clienteAxios from "../../../config/clienteAxios";
import TablaGenerica from "../others/TablaGenerica";
import { formatDecimal } from "../../helpers/formatDecimal";
const Hoya = ({ anio, semana }) => {
  const [registros, setRegistros] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get(`/reportes/facturacion-hoya/${anio}/${semana}`);
        console.log("Registros Hoya obtenidos:", response.data.registros);
        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error al obtener los registros Hoya:", error);
      }
    };
    if (anio && semana) {
      fetchData();
    }
  }, [anio, semana]);
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
  // Cálculo de totales para cada columna
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
  // Definir las columnas para la tabla
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
  // Crear la fila de totales a integrar en la tabla
  const totalesRow = {
    semana: "",
    fecha: "Totales",
    trabajosTallados: totals.trabajosTallados,
    precioTallado: formatDecimal(totals.precioTallado),
    trabajosHC: totals.trabajosHC,
    precioHC: formatDecimal(totals.precioHC),
    trabajosArPremium: totals.trabajosArPremium,
    precioArPremium: formatDecimal(totals.precioArPremium),
    trabajosArStandard: totals.trabajosArStandard,
    precioArStandard: formatDecimal(totals.precioArStandard),
    totalPrecio: formatDecimal(totals.totalPrecio)
  };
  return (
    <div className="mb-8">
      {registros.length > 0 && (
        <>
          <h2 className="text-center mb-4 uppercase font-semibold text-2xl text-gray-500">
            HOYA
          </h2>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <TablaGenerica columns={columns} data={data} totalesRow={totalesRow} />
          </div>
        </>
      )}
    </div>
  );
};
export default Hoya;