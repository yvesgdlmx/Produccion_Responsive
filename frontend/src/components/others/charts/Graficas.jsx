import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import Select from 'react-select';
import GraficaSemanal from './GraficaSemanal';
import GraficaDiaria from './GraficaDiaria';
// Importa el ModalSemanas y la data de semanas (ajusta la ruta según tu estructura)
import ModalSemanas from '../../modals/ModalSemanas';
import { dataSemanas } from '../arrays/ArrayFinanzas';
// Importa el ícono de calendario de Heroicons v2
import { CalendarIcon } from '@heroicons/react/24/outline';
const Graficas = () => {
  // Estado para controlar la apertura del modal en GraficaSemanal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Para la gráfica semanal: se generan opciones de semana (1-52)
  const currentWeek = moment().isoWeek();
  const weekOptions = Array.from({ length: 52 }, (_, i) => ({
    value: String(i + 1),
    label: `Semana ${i + 1}`
  }));
  const [selectedWeek, setSelectedWeek] = useState(
    weekOptions.find(option => option.value === String(currentWeek))
  );
  // Para la gráfica semanal: se selecciona un año.
  const yearOptions = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];
  const fechaActual = new Date();
  const anioActual = String(fechaActual.getFullYear());
  let defaultYear = yearOptions.find(option => option.value === anioActual);
  if (!defaultYear) {
    defaultYear = { value: anioActual, label: anioActual };
    yearOptions.push(defaultYear);
    yearOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
  }
  const [selectedYearWeekly, setSelectedYearWeekly] = useState(defaultYear);
  // Opciones para la gráfica diaria (filtros)
  const dailyYearOptions = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
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
  const dailyFechaActual = new Date();
  const dailyAnioActual = String(dailyFechaActual.getFullYear());
  const mesActual = String(dailyFechaActual.getMonth() + 1);
  const diaActual = String(dailyFechaActual.getDate());
  let defaultDailyYear = dailyYearOptions.find(option => option.value === dailyAnioActual);
  if (!defaultDailyYear) {
    defaultDailyYear = { value: dailyAnioActual, label: dailyAnioActual };
    dailyYearOptions.push(defaultDailyYear);
    dailyYearOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
  }
  const defaultMonth = monthOptions.find(option => option.value === mesActual);
  const defaultDay = dayOptions.find(option => option.value === diaActual);
  const [selectedDailyYear, setSelectedDailyYear] = useState(defaultDailyYear);
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
  // Opciones para la gráfica semanal (para Chart.js)
  const weekChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Producción por Semana' },
    },
  };
  // --------------------------
  // Mapeo manual de días y meses en inglés a español
  // --------------------------
  const diasEnEspanol = {
    sunday: "domingo",
    monday: "lunes",
    tuesday: "martes",
    wednesday: "miércoles",
    thursday: "jueves",
    friday: "viernes",
    saturday: "sábado"
  };
  const mesesEnEspanol = {
    january: "enero",
    february: "febrero",
    march: "marzo",
    april: "abril",
    may: "mayo",
    june: "junio",
    july: "julio",
    august: "agosto",
    september: "septiembre",
    october: "octubre",
    november: "noviembre",
    december: "diciembre"
  };
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  // --------------------------
  // Sección Gráfica Semanal
  // --------------------------
  const monday = moment()
    .year(Number(selectedYearWeekly.value))
    .isoWeek(Number(selectedWeek.value))
    .startOf('isoWeek');
  const effectiveStart = monday.clone().subtract(1, 'day').set({ hour: 22, minute: 0, second: 0 });
  const effectiveEnd = monday.clone().add(6, 'days').set({ hour: 21, minute: 59, second: 0 });
  const englishDayStart = effectiveStart.format('dddd').toLowerCase();
  const englishDayEnd = effectiveEnd.format('dddd').toLowerCase();
  const spanishDayStart = diasEnEspanol[englishDayStart] || englishDayStart;
  const spanishDayEnd = diasEnEspanol[englishDayEnd] || englishDayEnd;
  const englishMonthStart = effectiveStart.format('MMMM').toLowerCase();
  const englishMonthEnd = effectiveEnd.format('MMMM').toLowerCase();
  const spanishMonthStart = mesesEnEspanol[englishMonthStart] || englishMonthStart;
  const spanishMonthEnd = mesesEnEspanol[englishMonthEnd] || englishMonthEnd;
  const formattedStart = `${capitalize(spanishDayStart)} ${effectiveStart.format('D')} de ${capitalize(spanishMonthStart)}`;
  const formattedEnd = `${capitalize(spanishDayEnd)} ${effectiveEnd.format('D')} de ${capitalize(spanishMonthEnd)}`;
  // --------------------------
  // Sección Gráfica Diaria
  // --------------------------
  const dailySelectedDate = moment(
    `${selectedDailyYear.value}-${selectedMonth.value}-${selectedDay.value}`,
    "YYYY-M-D"
  );
  const effectiveDailyStart = dailySelectedDate.clone().subtract(1, 'day').set({ hour: 22, minute: 0, second: 0 });
  const effectiveDailyEnd = dailySelectedDate.clone().set({ hour: 21, minute: 59, second: 0 });
  const dailyEnglishDayStart = effectiveDailyStart.format('dddd').toLowerCase();
  const dailyEnglishDayEnd = effectiveDailyEnd.format('dddd').toLowerCase();
  const dailySpanishDayStart = diasEnEspanol[dailyEnglishDayStart] || dailyEnglishDayStart;
  const dailySpanishDayEnd = diasEnEspanol[dailyEnglishDayEnd] || dailyEnglishDayEnd;
  const dailyEnglishMonthStart = effectiveDailyStart.format('MMMM').toLowerCase();
  const dailyEnglishMonthEnd = effectiveDailyEnd.format('MMMM').toLowerCase();
  const dailySpanishMonthStart = mesesEnEspanol[dailyEnglishMonthStart] || dailyEnglishMonthStart;
  const dailySpanishMonthEnd = mesesEnEspanol[dailyEnglishMonthEnd] || dailyEnglishMonthEnd;
  const formattedDailyStart = `${capitalize(dailySpanishDayStart)} ${effectiveDailyStart.format('D')} de ${capitalize(dailySpanishMonthStart)}`;
  const formattedDailyEnd = `${capitalize(dailySpanishDayEnd)} ${effectiveDailyEnd.format('D')} de ${capitalize(dailySpanishMonthEnd)}`;
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        {/* Sección para Gráfica Semanal */}
        <div className="flex flex-col items-center mb-4">
          {/* Fila de selects centrados para gráfica semanal */}
          <div className="flex flex-row gap-2 items-center">
            <div className="flex items-center">
              <div className="w-32">
                <Select
                  options={yearOptions}
                  value={selectedYearWeekly}
                  onChange={setSelectedYearWeekly}
                  placeholder="Año"
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-64">
                <Select
                  options={weekOptions}
                  value={selectedWeek}
                  onChange={setSelectedWeek}
                  placeholder="Semana"
                  styles={customStyles}
                />
              </div>
            </div>
            {/* Botón para abrir el modal, ubicado al lado de los selects */}
            <div className="flex items-center">
              <button 
                className="flex items-center px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                <CalendarIcon className="h-5 w-5" />
                <span className="ml-2">Ver rangos</span>
              </button>
            </div>
          </div>
          {/* Fila del texto del rango semanal */}
          <div className="mt-2 text-sm text-gray-600">
            {formattedStart} a las 22:00 - {formattedEnd} a las 21:59
          </div>
        </div>
        {/* Gráfica Semanal */}
        <GraficaSemanal 
          weekChartOptions={weekChartOptions} 
          selectedWeek={selectedWeek} 
          selectedYear={selectedYearWeekly}
        />
      </div>
      <div>
        {/* Sección para Gráfica Diaria */}
        <div className="flex flex-col items-center mb-4">
          {/* Fila de selects centrales para gráfica diaria */}
          <div className="flex flex-row gap-2">
            <div className="flex items-center">
              <div className="w-48">
                <Select
                  options={dailyYearOptions}
                  value={selectedDailyYear}
                  onChange={setSelectedDailyYear}
                  placeholder="Año"
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-48">
                <Select
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  placeholder="Mes"
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex items-center">
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
          </div>
          {/* Fila del texto del rango diario */}
          <div className="mt-2 text-sm text-gray-600">
            {formattedDailyStart} a las 22:00 - {formattedDailyEnd} a las 21:59
          </div>
        </div>
        <GraficaDiaria
          selectedYear={selectedDailyYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
        />
      </div>
      {/* Modal para mostrar los rangos de fechas de las semanas */}
      <ModalSemanas 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        semanasData={dataSemanas}
      />
    </div>
  );
};
export default Graficas;