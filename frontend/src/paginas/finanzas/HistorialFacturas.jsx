import React, { useState } from "react";
import moment from "moment";
import SelectWipDiario from "../../components/others/html_personalizado/SelectWipDiario";
import HistorialNvi from "../../components/finanzas/historial/HistorialNvi";
import HistorialHoya from "../../components/finanzas/historial/HistorialHoya";
import HistorialInk from "../../components/finanzas/historial/HistorialInk";
import Heading from "../../components/others/Heading";
const HistorialFacturas = () => {
  // Se definen fechas por defecto (por ejemplo, usando ayer y anteayer)
  const defaultEnd = moment().subtract(1, "day");
  const defaultStart = moment().subtract(2, "day");
  // Se crean arrays para los selectores
  const anios = Array.from(new Set([defaultStart.year(), defaultEnd.year()]));
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dias = Array.from({ length: 31 }, (_, index) => index + 1);
  const anioOptions = anios.map((anio) => ({ value: anio, label: anio.toString() }));
  const mesOptions = meses.map((mes) => ({ value: mes, label: mes.toString() }));
  const diaOptions = dias.map((dia) => ({ value: dia, label: dia.toString() }));
  // Estados para la FECHA DE INICIO
  const [startYear, setStartYear] = useState(defaultStart.year());
  const [startMonth, setStartMonth] = useState(defaultStart.month() + 1);
  const [startDay, setStartDay] = useState(defaultStart.date());
  // Estados para la FECHA DE FIN
  const [endYear, setEndYear] = useState(defaultEnd.year());
  const [endMonth, setEndMonth] = useState(defaultEnd.month() + 1);
  const [endDay, setEndDay] = useState(defaultEnd.date());
  return (
    <div className="px-8 bg-gray-100 min-h-screen">
      <div className="px-4 py-2">
        <Heading title="Historial de facturas" />
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-6 justify-center">
        {/* Sección para la Fecha de Inicio */}
        <div className="p-4 flex-1">
          <h3 className="text-center font-semibold mb-4 text-gray-500 uppercase">Fecha Inicio</h3>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <SelectWipDiario
                options={anioOptions}
                value={anioOptions.find((o) => o.value === startYear)}
                onChange={(o) => setStartYear(o.value)}
                placeholder="Año"
              />
            </div>
            <div className="flex-1">
              <SelectWipDiario
                options={mesOptions}
                value={mesOptions.find((o) => o.value === startMonth)}
                onChange={(o) => setStartMonth(o.value)}
                placeholder="Mes"
              />
            </div>
            <div className="flex-1">
              <SelectWipDiario
                options={diaOptions}
                value={diaOptions.find((o) => o.value === startDay)}
                onChange={(o) => setStartDay(o.value)}
                placeholder="Día"
              />
            </div>
          </div>
        </div>
        {/* Sección para la Fecha de Fin */}
        <div className="p-4 flex-1">
          <h3 className="text-center font-semibold mb-4 text-gray-500 uppercase">Fecha Fin</h3>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <SelectWipDiario
                options={anioOptions}
                value={anioOptions.find((o) => o.value === endYear)}
                onChange={(o) => setEndYear(o.value)}
                placeholder="Año"
              />
            </div>
            <div className="flex-1">
              <SelectWipDiario
                options={mesOptions}
                value={mesOptions.find((o) => o.value === endMonth)}
                onChange={(o) => setEndMonth(o.value)}
                placeholder="Mes"
              />
            </div>
            <div className="flex-1">
              <SelectWipDiario
                options={diaOptions}
                value={diaOptions.find((o) => o.value === endDay)}
                onChange={(o) => setEndDay(o.value)}
                placeholder="Día"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Se pasan las fechas a los componentes hijos */}
      <HistorialNvi
        startYear={startYear}
        startMonth={startMonth}
        startDay={startDay}
        endYear={endYear}
        endMonth={endMonth}
        endDay={endDay}
      />
      <HistorialHoya
        startYear={startYear}
        startMonth={startMonth}
        startDay={startDay}
        endYear={endYear}
        endMonth={endMonth}
        endDay={endDay}
      />
      <HistorialInk
        startYear={startYear}
        startMonth={startMonth}
        startDay={startDay}
        endYear={endYear}
        endMonth={endMonth}
        endDay={endDay}
      />
    </div>
  );
};
export default HistorialFacturas;