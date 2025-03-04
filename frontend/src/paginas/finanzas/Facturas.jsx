import React, { useState } from 'react';
import Select from 'react-select';
import TablaGenerica from '../../components/others/TablaGenerica';
import { FaTable } from 'react-icons/fa';
import Heading from '../../components/others/Heading';
const Datos = () => {
  // Opciones para react‑select
  const optionsYear = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];
  const optionsWeek = [
    { value: '51', label: '51' },
    { value: '50', label: '50' },
    { value: '49', label: '49' },
  ];
  // Estados para almacenar la opción seleccionada
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  // Estilos personalizados para react‑select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#D1D5DB',
      boxShadow: 'none',
      '&:hover': { borderColor: '#9CA3AF' },
      borderRadius: '0.375rem'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  // Datos para la tabla NVI
  const nviData = [
    { semana: '51', dia: '16/12/2024', trabTerminadoNVI: '3,637', dineroTerminado: '$50,000.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,137', totalDinero: '$70,500.00' },
    { semana: '51', dia: '17/12/2024', trabTerminadoNVI: '3,638', dineroTerminado: '$50,001.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,138', totalDinero: '$70,501.00' },
    { semana: '51', dia: '18/12/2024', trabTerminadoNVI: '3,639', dineroTerminado: '$50,002.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,139', totalDinero: '$70,502.00' },
    { semana: '51', dia: '19/12/2024', trabTerminadoNVI: '3,640', dineroTerminado: '$50,003.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,140', totalDinero: '$70,503.00' },
    { semana: '51', dia: '20/12/2024', trabTerminadoNVI: '3,641', dineroTerminado: '$50,004.00', trabTalladoNVI: '4500', dineroTallado: '$20,500.00', trabNVIUV: '700', dineroNVIUV: '$7,000.00', trabNVIHC: '1800', dineroNVIHC: '$5,000.00', trabNVIAR: '2000', dineroNVIAR: '$8,500.00', totalTrab: '8,141', totalDinero: '$70,504.00' }
  ];
  // Datos para la tabla HOYA
  const hoyaData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '100', dineroTallado: '$150.00', trabHC: '30', dineroHC: '$70.00', trabARStandard: '20', dineroARStandard: '$100.00', trabARPremium: '50', dineroARPremium: '$110.00', totalTrab: '100', totalDinero: '$430.00' }
  ];
  // Datos para la tabla INK
  const inkData = [
    { semana: '51', dia: '16/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '17/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '18/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '19/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' },
    { semana: '51', dia: '20/12/2024', trabTalladoNVI: '70', dineroTallado: '$85.00', trabHC: '50', dineroHC: '$30.00', trabAR: '15', dineroAR: '$5,000.00', totalTrab: '70', totalDinero: '$5,115.00' }
  ];
  // Definición de columnas para cada tabla
  const columnsNvi = [
    { header: 'SEMANA', accessor: 'semana' },
    { header: 'DÍA', accessor: 'dia' },
    { header: 'Trab TERMINADO NVI', accessor: 'trabTerminadoNVI' },
    { header: '$ TERMINADO', accessor: 'dineroTerminado' },
    { header: 'Trab TALLADO NVI', accessor: 'trabTalladoNVI' },
    { header: '$ TALLADO', accessor: 'dineroTallado' },
    { header: 'Trab NVI UV', accessor: 'trabNVIUV' },
    { header: '$ NVI UV', accessor: 'dineroNVIUV' },
    { header: 'Trab NVI HC', accessor: 'trabNVIHC' },
    { header: '$ NVI HC', accessor: 'dineroNVIHC' },
    { header: 'Trab NVI AR', accessor: 'trabNVIAR' },
    { header: '$ NVI AR', accessor: 'dineroNVIAR' },
    { header: 'TOTAL TRAB NVI', accessor: 'totalTrab' },
    { header: 'TOTAL $ NVI', accessor: 'totalDinero' },
  ];
  const columnsHoya = [
    { header: 'SEMANA', accessor: 'semana' },
    { header: 'DÍA', accessor: 'dia' },
    { header: 'Trab TALLADO NVI', accessor: 'trabTalladoNVI' },
    { header: 'Tallado', accessor: 'dineroTallado' },
    { header: 'Trab HC', accessor: 'trabHC' },
    { header: 'HC', accessor: 'dineroHC' },
    { header: 'Trab AR Standard', accessor: 'trabARStandard' },
    { header: 'AR Standard', accessor: 'dineroARStandard' },
    { header: 'Trab AR Premium', accessor: 'trabARPremium' },
    { header: 'AR Premium', accessor: 'dineroARPremium' },
    { header: 'TOTAL TRAB HOYA', accessor: 'totalTrab' },
    { header: 'TOTAL $ HOYA', accessor: 'totalDinero' },
  ];
  const columnsInk = [
    { header: 'SEMANA', accessor: 'semana' },
    { header: 'DÍA', accessor: 'dia' },
    { header: 'Trab TALLADO NVI', accessor: 'trabTalladoNVI' },
    { header: 'Tallado', accessor: 'dineroTallado' },
    { header: 'Trab HC', accessor: 'trabHC' },
    { header: 'HC', accessor: 'dineroHC' },
    { header: 'Trab AR', accessor: 'trabAR' },
    { header: 'AR', accessor: 'dineroAR' },
    { header: 'TOTAL TRAB INK', accessor: 'totalTrab' },
    { header: 'TOTAL $ INK', accessor: 'totalDinero' },
  ];
  const renderFilterSelector = () => (
    <div className="flex flex-wrap justify-center gap-6 mb-8">
      <div className="w-64">
        <Select
          options={optionsYear}
          value={selectedYear}
          onChange={(option) => setSelectedYear(option)}
          placeholder="Selecciona un año"
          styles={customStyles}
        />
      </div>
      <div className="w-64">
        <Select
          options={optionsWeek}
          value={selectedWeek}
          onChange={(option) => setSelectedWeek(option)}
          placeholder="Selecciona una semana"
          styles={customStyles}
        />
      </div>
    </div>
  );
  return (
    <>
      <div className="px-4 py-2">
        <Heading title="Reporte de Facturación" />
      </div>
      <div className="p-2 space-y-10">
        {renderFilterSelector()}
        {/* Sección NVI */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
            <FaTable />
            <span>NVI</span>
          </h2>
          <TablaGenerica columns={columnsNvi} data={nviData} />
        </div>
        {/* Sección HOYA */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
            <FaTable />
            <span>HOYA</span>
          </h2>
          <TablaGenerica columns={columnsHoya} data={hoyaData} />
        </div>
        {/* Sección INK */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
            <FaTable />
            <span>INK</span>
          </h2>
          <TablaGenerica columns={columnsInk} data={inkData} />
        </div>
      </div>
    </>
  );
};
export default Datos;