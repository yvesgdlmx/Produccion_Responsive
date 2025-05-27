import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import clienteAxios from '../../../../config/clienteAxios';
import moment from 'moment';
const GraficaDiaria = ({ selectedYear, selectedMonth, selectedDay }) => {
  const [dataGrafica, setDataGrafica] = useState(null);
  /* Función para transformar la hora a un valor numérico para ordenar.
     Si la hora es menor a 22, se le suma 24 para que se consideren al final.
     Por ejemplo: 00:00 se transforma en 24, 01:00 en 25, etc. */
  const transformarHora = (horaStr) => {
    if (!horaStr) return 0;
    const [horas] = horaStr.split(':');
    const numHoras = parseInt(horas, 10);
    return numHoras < 22 ? numHoras + 24 : numHoras;
  };
  useEffect(() => {
    const obtenerDatos = async () => {
      const endpoint = `/manual/manual/surtido_detallado/${selectedYear.value}/${selectedMonth.value}/${selectedDay.value}`;
      try {
        const response = await clienteAxios.get(endpoint);
        let registros = response.data.registros;
        // Determinar el inicio y fin del período (22:00:00 del día anterior a 21:59:59 del día seleccionado)
        const fechaSeleccionada = moment(`${selectedYear.value}-${selectedMonth.value}-${selectedDay.value}`);
        const inicioPeriodo = fechaSeleccionada.clone().subtract(1, 'day').set({hour: 22, minute: 0, second: 0});
        const finPeriodo = fechaSeleccionada.clone().set({hour: 21, minute: 59, second: 59});
        // Filtrar registros dentro del rango de tiempo
        registros = registros.filter(registro => {
          const fechaHoraRegistro = moment(`${registro.fecha} ${registro.hour}`, 'YYYY-MM-DD HH:mm:ss');
          return fechaHoraRegistro.isBetween(inicioPeriodo, finPeriodo, null, '[]');
        });
        // Ordenar los registros por hora considerando el cambio de día
        registros.sort((a, b) => {
          const horaA = transformarHora(a.hour);
          const horaB = transformarHora(b.hour);
          return horaA - horaB;
        });
        // Agrupar los registros por hora
        const grupoPorHora = {};
        registros.forEach(registro => {
          const hora = registro.hour.slice(0, 5);
          if (!grupoPorHora[hora]) {
            grupoPorHora[hora] = { hour: hora, hits: 0 };
          }
          grupoPorHora[hora].hits += registro.hits;
        });
        // Convertir el objeto a array y ordenar las horas
        const registrosAgrupados = Object.values(grupoPorHora).sort((a, b) =>
          transformarHora(a.hour + ':00') - transformarHora(b.hour + ':00')
        );
        // Preparar la data para Chart.js
        const data = {
          labels: registrosAgrupados.map(registro => registro.hour),
          datasets: [
            {
              label: 'Producción diaria (hits)',
              data: registrosAgrupados.map(registro => registro.hits),
              borderColor: '#82ca9d',
              backgroundColor: 'rgba(130, 202, 157, 0.5)',
              tension: 0.4,
            },
          ],
        };
        setDataGrafica(data);
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
      }
    };
    obtenerDatos();
  }, [selectedYear, selectedMonth, selectedDay]);
  // Opciones para la gráfica
  const opcionesGrafica = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Producción por Día' },
    },
  };
  return (
    <div
      className="rounded-lg shadow-md p-4 bg-white"
      style={{ height: 400, overflowX: 'hidden' }}
    >
      {dataGrafica ? (
        <Line data={dataGrafica} options={opcionesGrafica} />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};
export default GraficaDiaria;