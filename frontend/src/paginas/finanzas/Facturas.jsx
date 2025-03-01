import React, { useState } from 'react';
import { FaDollarSign, FaTable } from 'react-icons/fa';
import Heading from '../../components/others/Heading';
const ResponsiveCard = ({ row, headers }) => {
  const { semana, dia, ...detalles } = row;
  const [isOpen, setIsOpen] = useState(false);
  // Se asume que los headers vienen en el mismo orden que las propiedades después de "semana" y "dia"
  const detallesHeaders = headers.slice(2);
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden mb-6">
      {/* Header clickeable */}
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-lg font-semibold">Día: {dia}</span>
        <div className="flex items-center gap-x-2">
          <span className="text-white text-lg font-semibold">Sem: {semana}</span>
          <span className="text-white text-xl transform transition-transform duration-300 ease-in-out">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>
      {/* Contenido colapsable */}
      {isOpen && (
        <div className="p-4 space-y-3 animate-fadeIn">
          {Object.entries(detalles).map(([key, value], idx) => (
            <div key={idx} className="flex justify-between border-b pb-1 last:border-none">
              <span className="text-gray-500">{detallesHeaders[idx] || key}</span>
              <span
                className={`text-gray-800 font-medium ${
                  value.includes('$')
                    ? 'inline-flex items-center gap-x-1 bg-green-50 text-green-600 px-2 py-1 rounded-full'
                    : ''
                }`}
              >
                {value.includes('$') && <FaDollarSign className="w-4 h-4" />}
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const renderResponsiveCards = (data, headers, title) => (
  <div className="lg:hidden mb-8 px-4">
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-x-2 py-4">
        <FaTable className="text-blue-800" /> {title}
      </h2>
      <hr className="border-t-2 border-gray-300 mx-auto w-3/4" />
    </div>
    {data.map((row, index) => (
      <ResponsiveCard key={index} row={row} headers={headers} />
    ))}
  </div>
);
const renderTable = (data, headers, title) => (
  <div className="max-w-full overflow-x-auto mb-8 bg-white pb-6 px-4 hidden lg:block scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
    <div className="min-w-[800px]">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-x-2 py-4">
          <FaTable className="text-blue-800" /> {title}
        </h2>
        <hr className="border-t-2 border-gray-300 mt-2" />
      </div>
      <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
        <thead className="bg-blue-500">
          <tr className="text-white text-xs uppercase tracking-wider">
            {headers.map((header, index) => (
              <th key={index} className="py-4 px-4 border-b border-gray-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b even:bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
            >
              {Object.entries(row).map(([key, value], idx) => (
                <td key={idx} className="py-4 px-6 text-center border-r last:border-r-0">
                  {value.includes('$') ? (
                    <div className="inline-flex items-center gap-x-2 bg-green-50 text-green-600 px-2 py-1 rounded-full">
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
  </div>
);
const Datos = () => {
  // Arreglos reestructurados en pocas líneas
  const nviData = [
    { semana: '51', dia: '16/12/2024', trabTerminadoNVI: '3,637', dineroTerminado: '$50,000.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,137', totalDinero: '$70,500.00' },
    { semana: '51', dia: '17/12/2024', trabTerminadoNVI: '3,638', dineroTerminado: '$50,001.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,138', totalDinero: '$70,501.00' },
    { semana: '51', dia: '18/12/2024', trabTerminadoNVI: '3,639', dineroTerminado: '$50,002.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,139', totalDinero: '$70,502.00' },
    { semana: '51', dia: '19/12/2024', trabTerminadoNVI: '3,640', dineroTerminado: '$50,003.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,140', totalDinero: '$70,503.00' },
    { semana: '51', dia: '20/12/2024', trabTerminadoNVI: '3,641', dineroTerminado: '$50,004.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,141', totalDinero: '$70,504.00' }
  ];
  const hoyaData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' }
  ];
  const inkData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' }
  ];
  const handleSelectChange = (e) => {
    console.log('Filtro actualizado:', e.target.name, e.target.value);
  };
  const renderFilterSelector = () => (
    <div className="flex flex-row gap-6 items-center justify-center mb-8">
      <div className="flex flex-col">
        <label htmlFor="year" className="mb-1 text-xs font-medium text-gray-600">Año</label>
        <select
          id="year"
          name="year"
          onChange={handleSelectChange}
          className="px-8 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="week" className="mb-1 text-xs font-medium text-gray-600">Semana</label>
        <select
          id="week"
          name="week"
          onChange={handleSelectChange}
          className="px-8 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        >
          <option value="51">51</option>
          <option value="50">50</option>
          <option value="49">49</option>
        </select>
      </div>
    </div>
  );
  // Encabezados
  const headersNvi = ['SEMANA', 'DÍA', 'Trab TERMINADO NVI', '$ TERMINADO', 'Trab TALLADO NVI', '$ TALLADO', 'Trab NVI UV', '$ NVI UV', 'Trab NVI HC', '$ NVI HC', 'Trab NVI AR', '$ NVI AR', 'TOTAL TRAB NVI', 'TOTAL $ NVI'];
  const headersHoya = ['SEMANA', 'DÍA', 'Trab TALLADO NVI', 'Tallado', 'Trab HC', 'HC', 'Trab AR Standard', 'AR Standard', 'Trab AR Premium', 'AR Premium', 'TOTAL TRAB HOYA', 'TOTAL $ HOYA'];
  const headersInk = ['SEMANA', 'DÍA', 'Trab TALLADO NVI', 'Tallado', 'Trab HC', 'HC', 'Trab AR', 'AR', 'TOTAL TRAB INK', 'TOTAL $ INK'];
  return (
    <>
      <div className="mt-6 md:mt-0">
        <Heading title="Reporte de facturación" />
      </div>
      <div className="space-y-8 p-4">
        {renderFilterSelector()}
        {renderTable(nviData, headersNvi, 'NVI')}
        {renderTable(hoyaData, headersHoya, 'HOYA')}
        {renderTable(inkData, headersInk, 'INK')}
        {renderResponsiveCards(nviData, headersNvi, 'NVI')}
        {renderResponsiveCards(hoyaData, headersHoya, 'HOYA')}
        {renderResponsiveCards(inkData, headersInk, 'INK')}
      </div>
    </>
  );
};
export default Datos;