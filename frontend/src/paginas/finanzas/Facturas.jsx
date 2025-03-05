import React, { useState } from 'react';
import Select from 'react-select';
import TablaGenerica from '../../components/others/TablaGenerica';
import CardRepoFacturacion from '../../components/others/cards/CardRepoFacturacion';
import CardTotalesRepoFacturacion from '../../components/others/cards/CardTotalesRepoFacturacion';
import { FaTable } from 'react-icons/fa';
import Heading from '../../components/others/Heading';
// Función para convertir un string de moneda a número
const convertToNumber = (moneyStr) => parseFloat(moneyStr.replace(/[$,]/g, ''));
// Función para formatear un número a moneda
const formatCurrency = (value) => {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
const Datos = () => {
  // Opciones para react‑select
  const optionsYear = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];
  const optionsWeek = [
    { value: '51', label: '51' },
    { value: '50', label: '50' },
    { value: '49', label: '49' }
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
    menu: (provided) => ({ ...provided, zIndex: 9999 })
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
  // Columnas para las tablas (versión escritorio)
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
    { header: 'TOTAL $ NVI', accessor: 'totalDinero' }
  ];
  const columnsHoya = [
    { header: 'SEMANA', accessor: 'semana' },
    { header: 'DÍA', accessor: 'dia' },
    { header: 'Trab TALLADO HOYA', accessor: 'trabTalladoNVI' },
    { header: '$ Tallado', accessor: 'dineroTallado' },
    { header: 'Trab HC', accessor: 'trabHC' },
    { header: '$ HC', accessor: 'dineroHC' },
    { header: 'Trab AR Standard', accessor: 'trabARStandard' },
    { header: '$ AR Standard', accessor: 'dineroARStandard' },
    { header: 'Trab AR Premium', accessor: 'trabARPremium' },
    { header: '$ AR Premium', accessor: 'dineroARPremium' },
    { header: 'TOTAL TRAB HOYA', accessor: 'totalTrab' },
    { header: 'TOTAL $ HOYA', accessor: 'totalDinero' }
  ];
  const columnsInk = [
    { header: 'SEMANA', accessor: 'semana' },
    { header: 'DÍA', accessor: 'dia' },
    { header: 'Trab TALLADO INK', accessor: 'trabTalladoNVI' },
    { header: '$ Tallado', accessor: 'dineroTallado' },
    { header: 'Trab HC', accessor: 'trabHC' },
    { header: '$ HC', accessor: 'dineroHC' },
    { header: 'Trab AR', accessor: 'trabAR' },
    { header: '$ AR', accessor: 'dineroAR' },
    { header: 'TOTAL TRAB INK', accessor: 'totalTrab' },
    { header: 'TOTAL $ INK', accessor: 'totalDinero' }
  ];
  // Totales globales y por columna
  const totalNvi = nviData.reduce((acc, row) => acc + convertToNumber(row.totalDinero), 0);
  const totalHoya = hoyaData.reduce((acc, row) => acc + convertToNumber(row.totalDinero), 0);
  const totalInk = inkData.reduce((acc, row) => acc + convertToNumber(row.totalDinero), 0);
  const totalDineroTerminado = nviData.reduce((acc, row) => acc + convertToNumber(row.dineroTerminado), 0);
  const totalDineroTallado   = nviData.reduce((acc, row) => acc + convertToNumber(row.dineroTallado), 0);
  const totalDineroNviUv     = nviData.reduce((acc, row) => acc + convertToNumber(row.dineroNVIUV), 0);
  const totalDineroNviHc     = nviData.reduce((acc, row) => acc + convertToNumber(row.dineroNVIHC), 0);
  const totalDineroNviAr     = nviData.reduce((acc, row) => acc + convertToNumber(row.dineroNVIAR), 0);
  const totalDineroTalladoHoya = hoyaData.reduce((acc, row) => acc + convertToNumber(row.dineroTallado), 0);
  const totalDineroArStandard  = hoyaData.reduce((acc, row) => acc + convertToNumber(row.dineroARStandard), 0);
  const totalDineroArPremium   = hoyaData.reduce((acc, row) => acc + convertToNumber(row.dineroARPremium), 0);
  const totalDineroTalladoInk = inkData.reduce((acc, row) => acc + convertToNumber(row.dineroTallado), 0);
  const totalDineroHcInk      = inkData.reduce((acc, row) => acc + convertToNumber(row.dineroHC), 0);
  const totalDineroArInk      = inkData.reduce((acc, row) => acc + convertToNumber(row.dineroAR), 0);
  // Configuración de campos para el componente CardRepoFacturacion
  const camposNvi = [
    { label: 'Semana', accessor: 'semana' },
    { label: 'Día', accessor: 'dia' },
    { label: 'Trab. Terminado', accessor: 'trabTerminadoNVI' },
    { label: '$ Terminados', accessor: 'dineroTerminado' },
    { label: 'Trab. Tallado', accessor: 'trabTalladoNVI' },
    { label: '$ Tallado', accessor: 'dineroTallado' },
    { label: 'Trab. NVI UV', accessor: 'trabNVIUV' },
    { label: '$ NVI UV', accessor: 'dineroNVIUV' },
    { label: 'Trab. NVI HC', accessor: 'trabNVIHC' },
    { label: '$ NVI HC', accessor: 'dineroNVIHC' },
    { label: 'Trab. NVI AR', accessor: 'trabNVIAR' },
    { label: '$ NVI AR', accessor: 'dineroNVIAR' },
    { label: 'Total Trab', accessor: 'totalTrab' },
    { label: 'Total $', accessor: 'totalDinero' },
  ];
  const camposHoya = [
    { label: 'Semana', accessor: 'semana' },
    { label: 'Día', accessor: 'dia' },
    { label: 'Trab. Tallado', accessor: 'trabTalladoNVI' },
    { label: '$ Tallado', accessor: 'dineroTallado' },
    { label: 'Trab. HC', accessor: 'trabHC' },
    { label: '$ HC', accessor: 'dineroHC' },
    { label: 'AR Standard', accessor: 'trabARStandard' },
    { label: '$ AR Standard', accessor: 'dineroARStandard' },
    { label: 'AR Premium', accessor: 'trabARPremium' },
    { label: '$ AR Premium', accessor: 'dineroARPremium' },
    { label: 'Total Trab', accessor: 'totalTrab' },
    { label: 'Total $', accessor: 'totalDinero' },
  ];
  const camposInk = [
    { label: 'Semana', accessor: 'semana' },
    { label: 'Día', accessor: 'dia' },
    { label: 'Trab. Tallado', accessor: 'trabTalladoNVI' },
    { label: '$ Tallado', accessor: 'dineroTallado' },
    { label: 'Trab. HC', accessor: 'trabHC' },
    { label: '$ HC', accessor: 'dineroHC' },
    { label: 'Trab. AR', accessor: 'trabAR' },
    { label: '$ AR', accessor: 'dineroAR' },
    { label: 'Total Trab', accessor: 'totalTrab' },
    { label: 'Total $', accessor: 'totalDinero' },
  ];
  // Renderizado de filtros
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
        {/* Sección de escritorio (tablas) solo visible en md y superiores */}
        <div className="hidden md:block space-y-10">
          {/* Tabla NVI */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
              <FaTable /> <span>NVI</span>
            </h2>
            <TablaGenerica columns={columnsNvi} data={nviData} />
          </div>
          {/* Tabla HOYA */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
              <FaTable /> <span>HOYA</span>
            </h2>
            <TablaGenerica columns={columnsHoya} data={hoyaData} />
          </div>
          {/* Tabla INK */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2 mb-4">
              <FaTable /> <span>INK</span>
            </h2>
            <TablaGenerica columns={columnsInk} data={inkData} />
          </div>
        </div>
        {/* Sección móvil (Cards) visible en pantallas pequeñas */}
        <div className="block md:hidden space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">NVI</h2>
            {nviData.map((registro, index) => (
              <CardRepoFacturacion 
                key={index}
                registro={registro}
                headerTitle={`Registro ${index + 1}`}
                fields={camposNvi}
              />
            ))}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">HOYA</h2>
            {hoyaData.map((registro, index) => (
              <CardRepoFacturacion 
                key={index}
                registro={registro}
                headerTitle={`Registro ${index + 1}`}
                fields={camposHoya}
              />
            ))}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">INK</h2>
            {inkData.map((registro, index) => (
              <CardRepoFacturacion 
                key={index}
                registro={registro}
                headerTitle={`Registro ${index + 1}`}
                fields={camposInk}
              />
            ))}
          </div>
        </div>
        {/* Sección de totales utilizando el componente TotalesGrid */}
        <CardTotalesRepoFacturacion
          totalNvi={totalNvi}
          totalDineroTerminado={totalDineroTerminado}
          totalDineroTallado={totalDineroTallado}
          totalDineroNviUv={totalDineroNviUv}
          totalDineroNviHc={totalDineroNviHc}
          totalDineroNviAr={totalDineroNviAr}
          totalHoya={totalHoya}
          totalDineroTalladoHoya={totalDineroTalladoHoya}
          totalDineroArStandard={totalDineroArStandard}
          totalDineroArPremium={totalDineroArPremium}
          totalInk={totalInk}
          totalDineroTalladoInk={totalDineroTalladoInk}
          totalDineroHcInk={totalDineroHcInk}
          totalDineroArInk={totalDineroArInk}
          formatCurrency={formatCurrency}
        />
      </div>
    </>
  );
};
export default Datos;