import React from 'react';
import { Line } from 'react-chartjs-2';

const GraficaSemanal = ({ weekChartData, weekChartOptions }) => {
  const options = {
    maintainAspectRatio: false,
    ...weekChartOptions
  };
  return (
    <div
      className="rounded-lg shadow-md p-4 bg-white"
      style={{ height: 400, overflowX: 'hidden' }}
    >
      <div className="flex justify-center items-center h-full">
        <Line data={weekChartData} options={options} />
      </div>
    </div>
  );
};
export default GraficaSemanal;