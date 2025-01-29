import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { FaTable } from 'react-icons/fa'; // Icono para el título


const Datos = () => {
  const nviData = [
    { semana: '51', dia: '16/12/2024', trabTerminadoNVI: '3,637', dineroTerminado: '$50,000.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,137', totalDinero: '$70,500.00' },
    { semana: '51', dia: '17/12/2024', trabTerminadoNVI: '3,638', dineroTerminado: '$50,001.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,138', totalDinero: '$70,501.00' },
    { semana: '51', dia: '18/12/2024', trabTerminadoNVI: '3,639', dineroTerminado: '$50,002.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,139', totalDinero: '$70,502.00' },
    { semana: '51', dia: '19/12/2024', trabTerminadoNVI: '3,640', dineroTerminado: '$50,003.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,140', totalDinero: '$70,503.00' },
    { semana: '51', dia: '20/12/2024', trabTerminadoNVI: '3,641', dineroTerminado: '$50,004.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,141', totalDinero: '$70,504.00' },
  ];

  const hoyaData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
  ];

  const inkData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
  ];

  const renderTable = (data, headers, title) => (
    <div className="max-w-full overflow-x-auto mb-8">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-x-2">
          <FaTable className="text-blue-800" /> {title}
        </h2>
        <hr className="border-t-2 border-gray-300 mt-2" />
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
        <thead className="bg-gradient-to-r from-blue-200 to-blue-400">
          <tr className="text-gray-800 text-xs uppercase tracking-wider">
            {headers.map((header, index) => (
              <th key={index} className="py-4 px-6 border-b-2 border-gray-200">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-200 transition duration-300">
              {Object.entries(row).map(([key, value], index) => (
                <td key={index} className="py-4 px-6 text-center border-r last:border-r-0">
                  {value.includes('$') ? (
                    <div className="inline-flex items-center gap-x-2 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <FaDollarSign className="w-4 h-4" />
                      <span>{value}</span>
                    </div>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 p-4">
      {renderTable(nviData, [
        "SEMANA", "DÍA", "Trab TERMINADO NVI", "$ TERMINADO", "Trab TALLADO NVI", "$ TALLADO",
        "Trab NVI UV", "$ NVI UV", "Trab NVI HC", "$ NVI HC", "Trab NVI AR", "$ NVI AR",
        "TOTAL TRAB NVI", "TOTAL $ NVI"
      ], "NVI")}
      {renderTable(hoyaData, [
        "SEMANA", "DÍA", "Trab TALLADO NVI", "Tallado", "Trab HC", "HC",
        "Trab AR Standard", "AR Standard", "Trab AR Premium", "AR Premium",
        "TOTAL TRAB HOYA", "TOTAL $ HOYA"
      ], "HOYA")}
      {renderTable(inkData, [
        "SEMANA", "DÍA", "Trab TALLADO NVI", "Tallado", "Trab HC", "HC",
        "Trab AR", "AR", "TOTAL TRAB INK", "TOTAL $ INK"
      ], "INK")}
    </div>
  );
};

export default Datos;