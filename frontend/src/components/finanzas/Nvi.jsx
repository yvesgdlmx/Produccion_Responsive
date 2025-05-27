import React, { useEffect, useState } from "react";
import clienteAxios from "../../../config/clienteAxios";
import TablaGenerica from "../others/TablaGenerica";
import { formatNumber } from "../../helpers/formatNumber";
const Nvi = ({ anio, semana }) => {
  const [registros, setRegistros] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get(`/reportes/facturacion-nvi/${anio}/${semana}`);
        console.log("Registros Nvi obtenidos:", response.data.registros);
        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error al obtener los registros (Nvi):", error);
      }
    };
    if (anio && semana) {
      fetchData();
    }
  }, [anio, semana]);
  // Mapeo de cada registro para la tabla
  const data = registros.map((registro) => {
    // Cálculos individuales
    const trabTermNvi = registro.p_frm_f_lenses + registro.m_frm_f_lenses;
    const terminado =
      parseFloat(registro.p_frm_f) +
      parseFloat(registro.m_frm_f) +
      parseFloat(registro.grad_f) +
      parseFloat(registro.sol_f) +
      parseFloat(registro.uv_f);
    const tallado =
      parseFloat(registro.cot_coat) +
      parseFloat(registro.surf_cost) +
      parseFloat(registro.ar) +
      parseFloat(registro.grad_s) +
      parseFloat(registro.sol_s) +
      parseFloat(registro.uv_s) +
      parseFloat(registro.p_frm_s) +
      parseFloat(registro.m_frm_s) +
      parseFloat(registro.ar_lenses);
    const totalNviFila = terminado + tallado;
    const totalReal = parseFloat(registro.total_real) || 0;
    const diferencia = Math.trunc(totalReal - totalNviFila);
    const talladoAjustado = tallado + diferencia;
    const trabNviHC = parseFloat(registro.cot_coat) + Math.trunc(totalReal - totalNviFila);
    const nuevoNviHC = trabNviHC;
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
      trabNviUV: formatNumber(
        parseFloat(registro.uv_s_lenses) + parseFloat(registro.uv_f_lenses)
      ),
      nviUV: formatNumber(parseFloat(registro.uv_s) + parseFloat(registro.uv_f)),
      trabNviHC: formatNumber(trabNviHC),
      nviHC: formatNumber(nuevoNviHC),
      trabNviAR: formatNumber(registro.ar_lenses),
      nviAR: formatNumber(parseFloat(registro.ar)),
      totalTrab: formatNumber(trabTermNvi + Number(registro.surf_lenses)),
      totalNvi: formatNumber(totalNviCorregido),
    };
  });
  // Cálculo de totales utilizando los registros originales (sin formateo)
  const totales = registros.reduce(
    (acc, registro) => {
      // Calcular los valores raw para cada registro
      const trabTerm = registro.p_frm_f_lenses + registro.m_frm_f_lenses;
      const terminado = 
        parseFloat(registro.p_frm_f) +
        parseFloat(registro.m_frm_f) +
        parseFloat(registro.grad_f) +
        parseFloat(registro.sol_f) +
        parseFloat(registro.uv_f);
      const trabTall = Number(registro.surf_lenses);
      const tallado = 
        parseFloat(registro.cot_coat) +
        parseFloat(registro.surf_cost) +
        parseFloat(registro.ar) +
        parseFloat(registro.grad_s) +
        parseFloat(registro.sol_s) +
        parseFloat(registro.uv_s) +
        parseFloat(registro.p_frm_s) +
        parseFloat(registro.m_frm_s) +
        parseFloat(registro.ar_lenses);
      const totalFila = terminado + tallado;
      const totalReal = parseFloat(registro.total_real) || 0;
      const diferencia = Math.trunc(totalReal - totalFila);
      const talladoAju = tallado + diferencia;
      const trabNviHC = parseFloat(registro.cot_coat) + Math.trunc(totalReal - totalFila);
      const nviHC = trabNviHC;
      const nviUV = parseFloat(registro.uv_s) + parseFloat(registro.uv_f);
      const trabNviAR = Number(registro.ar_lenses);
      const nviAR = parseFloat(registro.ar);
      const totalTrab = trabTerm + trabTall;
      const parteEnteraTotalReal = Math.floor(totalReal);
      const parteDecimalTotalNvi = totalFila - Math.floor(totalFila);
      const totalNviCorr = parteEnteraTotalReal + parteDecimalTotalNvi;
      
      return {
        trabTermNvi: acc.trabTermNvi + trabTerm,
        terminado: acc.terminado + terminado,
        trabTallNvi: acc.trabTallNvi + trabTall,
        tallado: acc.tallado + talladoAju,
        trabNviUV: acc.trabNviUV + (parseFloat(registro.uv_s_lenses) + parseFloat(registro.uv_f_lenses)),
        nviUV: acc.nviUV + nviUV,
        trabNviHC: acc.trabNviHC + trabNviHC,
        nviHC: acc.nviHC + nviHC,
        trabNviAR: acc.trabNviAR + trabNviAR,
        nviAR: acc.nviAR + nviAR,
        totalTrab: acc.totalTrab + totalTrab,
        totalNvi: acc.totalNvi + totalNviCorr,
      };
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
      totalNvi: 0,
    }
  );
  const totalNviGlobal = totales.terminado + totales.tallado;
  // Definir las columnas de la tabla
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
    { header: "Total $ Nvi", accessor: "totalNvi" },
  ];
  // Crear la fila de totales para mostrar en la tabla
  const totalesRow = {
    semana: "",
    fecha: "Totales",
    trabTermNvi: formatNumber(totales.trabTermNvi),
    terminado: formatNumber(totales.terminado),
    trabTallNvi: formatNumber(totales.trabTallNvi),
    tallado: formatNumber(totales.tallado),
    trabNviUV: formatNumber(totales.trabNviUV),
    nviUV: formatNumber(totales.nviUV),
    trabNviHC: formatNumber(totales.trabNviHC),
    nviHC: formatNumber(totales.nviHC),
    trabNviAR: formatNumber(totales.trabNviAR),
    nviAR: formatNumber(totales.nviAR),
    totalTrab: formatNumber(totales.totalTrab),
    totalNvi: formatNumber(totales.totalNvi),
  };
  return (
    <div className="mb-8">
      {registros.length > 0 && (
        <>
          <h2 className="text-center mb-4 uppercase font-semibold text-2xl text-gray-500">
            NVI
          </h2>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <TablaGenerica columns={columns} data={data} totalesRow={totalesRow} />
          </div>
        </>
      )}
    </div>
  );
};
export default Nvi;