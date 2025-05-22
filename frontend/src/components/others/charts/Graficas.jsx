import React, { useState } from 'react';
import Select from 'react-select';
import GraficaSemanal from './GraficaSemanal';
import GraficaDiaria from './GraficaDiaria';
const Graficas = () => {
  // Opciones y estado para la gráfica semanal (estáticos)
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
  // Opciones para la gráfica diaria (filtros)
  // Se pueden agregar los años que se requieran. Si el año actual no existe, se puede agregar.
  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];
  // Opciones para el mes y día
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
  // Obtener la fecha actual
  const fechaActual = new Date();
  const añoActual = String(fechaActual.getFullYear());
  const mesActual = String(fechaActual.getMonth() + 1);
  const diaActual = String(fechaActual.getDate());
  // Buscar la opción correspondiente en cada select
  let defaultYear = yearOptions.find(option => option.value === añoActual);
  // En caso de que el año actual no se encuentre en yearOptions, lo agrega.
  if (!defaultYear) {
    defaultYear = { value: añoActual, label: añoActual };
    yearOptions.push(defaultYear);
    // Ordenamos los años (opcional)
    yearOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
  }
  const defaultMonth = monthOptions.find(option => option.value === mesActual);
  const defaultDay = dayOptions.find(option => option.value === diaActual);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  // Estilos personalizados para los selects
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#D1D5DB',
      boxShadow: 'none',
      '&:hover': { borderColor: '#9CA3AF' },
      height: '40px',
      minHeight: '40px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '40px',
      padding: '0 6px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '40px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        {/* Gráfica semanal */}
        <div className="flex justify-end items-center mb-4">
          <span className="text-sm font-semibold text-gray-700 mr-2">
            Filtrar por semana:
          </span>
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
        {/* Filtros para la gráfica diaria */}
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
        {/* Se envían los filtros necesarios a la gráfica diaria */}
        <GraficaDiaria
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
        />
      </div>
    </div>
  );
};
export default Graficas;