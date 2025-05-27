import React, { useEffect, useState } from "react";
import clienteAxios from "../../../../config/clienteAxios";
import TablaGenerica from "../../others/TablaGenerica";
import { formatNumber } from "../../../helpers/formatNumber";
import Alerta from "../../others/alertas/Alerta";
const HistorialNvi = ({ startYear, startMonth, startDay, endYear, endMonth, endDay }) => {
  const [registros, setRegistros] = useState([]);
  // Función para formatear números (agrega cero a la izquierda si es menor a 10)
  const formatNum = (num) => (num < 10 ? `0${num}` : num);
  // Armar las fechas en el formato YYYY-MM-DD
  const fechaInicio = `${startYear}-${formatNum(startMonth)}-${formatNum(startDay)}`;
  const fechaFin = `${endYear}-${formatNum(endMonth)}-${formatNum(endDay)}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get(`/reportes/facturacion-nvi/rango/${fechaInicio}/${fechaFin}`);
        console.log("Datos obtenidos:", response.data.registros);
        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      }
    };
    // Se ejecuta la consulta cada vez que cambian las fechas
    fetchData();
  }, [fechaInicio, fechaFin]);
  // Mapeo de cada registro a la estructura que usará la tabla
  const data = registros.map((registro) => {
    const trabTermNvi = Number(registro.p_frm_f_lenses) + Number(registro.m_frm_f_lenses);
    const terminado =
      Number(registro.p_frm_f) +
      Number(registro.m_frm_f) +
      Number(registro.grad_f) +
      Number(registro.sol_f) +
      Number(registro.uv_f);
    const tallado =
      Number(registro.cot_coat) +
      Number(registro.surf_cost) +
      Number(registro.ar) +
      Number(registro.grad_s) +
      Number(registro.sol_s) +
      Number(registro.uv_s) +
      Number(registro.p_frm_s) +
      Number(registro.m_frm_s) +
      Number(registro.ar_lenses);
    const totalNviFila = terminado + tallado;
    const totalReal = Number(registro.total_real) || 0;
    const diferencia = Math.trunc(totalReal - totalNviFila);
    const talladoAjustado = tallado + diferencia;
    const trabNviHC = Number(registro.cot_coat) + Math.trunc(totalReal - totalNviFila);
    const parteEnteraTotalReal = Math.floor(totalReal);
    const parteDecimalTotalNvi = totalNviFila - Math.floor(totalNviFila);
    const totalNviCorregido = parteEnteraTotalReal + parteDecimalTotalNvi;
    return {
      semana: registro.semana,
      fecha: registro.fecha,
      trabTermNvi: formatNumber(trabTermNvi),
      terminado: formatNumber(terminado),
      trabTallNvi: formatNumber(registro.surf_lenses),
      tallado: formatNumber(talladoAjustado),
      trabNviUV: formatNumber(Number(registro.uv_s_lenses) + Number(registro.uv_f_lenses)),
      nviUV: formatNumber(Number(registro.uv_s) + Number(registro.uv_f)),
      trabNviHC: formatNumber(trabNviHC),
      nviHC: formatNumber(trabNviHC), // Se mantiene la misma lógica de ajuste
      trabNviAR: formatNumber(registro.ar_lenses),
      nviAR: formatNumber(Number(registro.ar)),
      totalTrab: formatNumber(trabTermNvi + Number(registro.surf_lenses)),
      totalNvi: formatNumber(totalNviCorregido)
    };
  });
  // Cálculo de totales generales utilizando los registros originales
  const sums = registros.reduce(
    (acc, registro) => {
      const trabTermNvi = Number(registro.p_frm_f_lenses) + Number(registro.m_frm_f_lenses);
      const terminado =
        Number(registro.p_frm_f) +
        Number(registro.m_frm_f) +
        Number(registro.grad_f) +
        Number(registro.sol_f) +
        Number(registro.uv_f);
      const trabTallNvi = Number(registro.surf_lenses);
      const tallado =
        Number(registro.cot_coat) +
        Number(registro.surf_cost) +
        Number(registro.ar) +
        Number(registro.grad_s) +
        Number(registro.sol_s) +
        Number(registro.uv_s) +
        Number(registro.p_frm_s) +
        Number(registro.m_frm_s) +
        Number(registro.ar_lenses);
      const totalNviFila = terminado + tallado;
      const totalReal = Number(registro.total_real) || 0;
      const diferencia = Math.trunc(totalReal - totalNviFila);
      const talladoAjustado = tallado + diferencia;
      const trabNviHC = Number(registro.cot_coat) + Math.trunc(totalReal - totalNviFila);
      const trabNviUV = Number(registro.uv_s_lenses) + Number(registro.uv_f_lenses);
      const nviUV = Number(registro.uv_s) + Number(registro.uv_f);
      const trabNviAR = Number(registro.ar_lenses);
      const nviAR = Number(registro.ar);
      const totalTrab = trabTermNvi + Number(registro.surf_lenses);
      const parteEnteraTotalReal = Math.floor(totalReal);
      const parteDecimalTotalNvi = totalNviFila - Math.floor(totalNviFila);
      const totalNviCorregido = parteEnteraTotalReal + parteDecimalTotalNvi;
      acc.trabTermNvi += trabTermNvi;
      acc.terminado += terminado;
      acc.trabTallNvi += trabTallNvi;
      acc.tallado += talladoAjustado;
      acc.trabNviUV += trabNviUV;
      acc.nviUV += nviUV;
      acc.trabNviHC += trabNviHC;
      acc.nviHC += trabNviHC;
      acc.trabNviAR += trabNviAR;
      acc.nviAR += nviAR;
      acc.totalTrab += totalTrab;
      acc.totalNvi += totalNviCorregido;
      return acc;
    },
    {
      trabTermNvi: 0,
      terminado: 0,
      trabTallNvi: 0,
      tallado: 0,
      trabNviUV: 0,
      nviUV: 0,
      trabNviHC: 0,
      nviHC: 0,
      trabNviAR: 0,
      nviAR: 0,
      totalTrab: 0,
      totalNvi: 0
    }
  );
  // Crear el objeto de totales para la fila extra de la tabla.
  const totalsRow = {
    semana: "",
    fecha: "Totales",
    trabTermNvi: formatNumber(sums.trabTermNvi),
    terminado: formatNumber(sums.terminado),
    trabTallNvi: formatNumber(sums.trabTallNvi),
    tallado: formatNumber(sums.tallado),
    trabNviUV: formatNumber(sums.trabNviUV),
    nviUV: formatNumber(sums.nviUV),
    trabNviHC: formatNumber(sums.trabNviHC),
    nviHC: formatNumber(sums.nviHC),
    trabNviAR: formatNumber(sums.trabNviAR),
    nviAR: formatNumber(sums.nviAR),
    totalTrab: formatNumber(sums.totalTrab),
    totalNvi: formatNumber(sums.totalNvi)
  };
  const columns = [
    { header: "Semana", accessor: "semana" },
    { header: "Fecha", accessor: "fecha" },
    { header: "Trab term. nvi", accessor: "trabTermNvi" },
    { header: "$ Terminado", accessor: "terminado" },
    { header: "Trab tall. nvi", accessor: "trabTallNvi" },
    { header: "$ Tallado", accessor: "tallado" },
    { header: "Trab. NVI UV", accessor: "trabNviUV" },
    { header: "$ NVI UV", accessor: "nviUV" },
    { header: "Trab. NVI HC", accessor: "trabNviHC" },
    { header: "$ NVI HC", accessor: "nviHC" },
    { header: "Trab NVI AR", accessor: "trabNviAR" },
    { header: "$ NVI AR", accessor: "nviAR" },
    { header: "Total trab. Nvi", accessor: "totalTrab" },
    { header: "Total $ Nvi", accessor: "totalNvi" }
  ];
  return (
    <div className="mb-8">
      {registros.length > 0 ? (
        <>
          <h2 className="text-center mb-4 uppercase font-semibold text-2xl text-gray-500">
            NVI
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
export default HistorialNvi;