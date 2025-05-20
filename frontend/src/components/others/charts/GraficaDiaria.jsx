import React from 'react';
import { Line } from 'react-chartjs-2';

const GraficaDiaria = ({ dailyChartData, dailyChartOptions }) => {
  // Se crea un objeto de opciones combinando las que ya traes y forzando maintainAspectRatio a false.
  const options = {
    maintainAspectRatio: false,
    ...dailyChartOptions
  };
  return (
    <div
      className="rounded-lg shadow-md p-4 bg-white"
      style={{ height: 400, overflowX: 'hidden' }}
    >
      <div className="flex justify-center items-center h-full">
        <Line data={dailyChartData} options={options} />
      </div>
    </div>
  );
};
export default GraficaDiaria;