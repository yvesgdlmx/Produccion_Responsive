import React, { useState } from 'react';
import Select from 'react-select';
import GraficaSemanal from './GraficaSemanal';
import GraficaDiaria from './GraficaDiaria';
const Graficas = () => {
  // Gráfica semanal
  const weekOptions = [
    { value: 'current', label: 'Semana Actual' },
    { value: 'last', label: 'Semana Pasada' },
    { value: 'two', label: 'Hace dos semanas' },
  ];
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0]);
  const weekChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Producción semanal',
        data: [120, 98, 110, 130, 95, 105, 115],
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.5)',
        tension: 0.4,
      },
    ],
  };
  const weekChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Producción por Semana' },
    },
  };
  // Gráfica diaria
  const yearOptions = [
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];
  const monthOptions = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [selectedDay, setSelectedDay] = useState(dayOptions[0]);
  const dailyLabels = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  );
  const dailyChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Producción diaria',
        data: dailyLabels.map(() => Math.floor(Math.random() * 100) + 50),
        borderColor: '#82ca9d',
        backgroundColor: 'rgba(130, 202, 157, 0.5)',
        tension: 0.4,
      },
    ],
  };
  const dailyChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Producción por Día' },
    },
  };
  const customStyles = {
    control: provided => ({
      ...provided,
      borderColor: '#D1D5DB',
      boxShadow: 'none',
      '&:hover': { borderColor: '#9CA3AF' },
      height: '40px',
      minHeight: '40px',
    }),
    valueContainer: provided => ({
      ...provided,
      height: '40px',
      padding: '0 6px',
    }),
    indicatorsContainer: provided => ({
      ...provided,
      height: '40px',
    }),
    menu: provided => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-end items-center mb-4">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filtrar por semana:</span>
          <div className="w-64">
            <Select
              options={weekOptions}
              value={selectedWeek}
              onChange={setSelectedWeek}
              placeholder="Selecciona semana..."
              styles={customStyles}
            />
          </div>
        </div>
        <GraficaSemanal weekChartData={weekChartData} weekChartOptions={weekChartOptions} />
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4 mb-4">
          <div className="w-48">
            <Select
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Año"
              styles={customStyles}
            />
          </div>
          <div className="w-48">
            <Select
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Mes"
              styles={customStyles}
            />
          </div>
          <div className="w-48">
            <Select
              options={dayOptions}
              value={selectedDay}
              onChange={setSelectedDay}
              placeholder="Día"
              styles={customStyles}
            />
          </div>
        </div>
        <GraficaDiaria dailyChartData={dailyChartData} dailyChartOptions={dailyChartOptions} />
      </div>
    </div>
  );
};
export default Graficas;