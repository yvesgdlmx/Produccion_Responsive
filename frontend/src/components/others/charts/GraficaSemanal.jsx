import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
// Configuramos el locale en español para que se muestren los días en español.
moment.locale('es');
import { Line } from 'react-chartjs-2';
import clienteAxios from '../../../../config/clienteAxios';
const GraficaSemanal = ({ weekChartOptions, selectedWeek, selectedYear }) => {
  const [dataGrafica, setDataGrafica] = useState(null);
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Se utiliza el año y la semana seleccionados para construir el endpoint.
        const endpoint = `/manual/manual/semanal/${selectedYear.value}/${selectedWeek.value}`;
        const response = await clienteAxios.get(endpoint);
        console.log("Datos semanales recibidos:", response.data);
        // Se asume que la API retorna: { registros: [ { fecha, hour, hits, name, ... }, ... ] }
        const registros = response.data.registros;
        // Creamos un objeto para agrupar los hits por "fecha efectiva"
        // La "fecha efectiva" se determina así:
        // - Se crea un objeto moment combinando r.fecha y r.hour.
        // - Se define un umbral que es ese mismo día a las 22:00:00.
        // - Si la fecha con hora es igual o posterior al umbral, se suma 1 día a r.fecha.
        const agrupados = {};
        registros.forEach((r) => {
          const fechaYHora = moment(`${r.fecha} ${r.hour}`, "YYYY-MM-DD HH:mm:ss");
          const umbral = moment(`${r.fecha} 22:00:00`, "YYYY-MM-DD HH:mm:ss");
          let fechaEfectiva = moment(r.fecha, "YYYY-MM-DD");
          if (fechaYHora.isSameOrAfter(umbral)) {
            fechaEfectiva = fechaEfectiva.add(1, 'day');
          }
          const key = fechaEfectiva.format("YYYY-MM-DD");
          if (!agrupados[key]) {
            agrupados[key] = 0;
          }
          agrupados[key] += r.hits;
        });
        // Definimos el inicio de la semana usando isoWeek sin restar 1 día (esta semana empieza en lunes)
        const inicioSemana = moment()
          .year(Number(selectedYear.value))
          .isoWeek(Number(selectedWeek.value))
          .startOf("isoWeek");
        // Se generan los labels (Lun, Mar, Mié, Jue, Vie, Sáb, Dom) y los datos correspondientes
        const labels = [];
        const datos = [];
        for (let i = 0; i < 7; i++) {
          const dia = inicioSemana.clone().add(i, 'day');
          labels.push(dia.format('ddd')); // 'ddd' devuelve la abreviatura (por ejemplo: Lun)
          datos.push(agrupados[dia.format("YYYY-MM-DD")] || 0);
        }
        // Armamos el objeto para Chart.js
        const dataChart = {
          labels,
          datasets: [
            {
              label: 'Producción semanal (hits)',
              data: datos,
              borderColor: '#8884d8',
              backgroundColor: 'rgba(136,132,216,0.5)',
              tension: 0.4,
            },
          ],
        };
        setDataGrafica(dataChart);
      } catch (error) {
        console.error("Error al obtener datos semanales:", error);
      }
    };
    if (selectedYear && selectedWeek) {
      obtenerDatos();
    }
  }, [selectedYear, selectedWeek]);
  const options = {
    maintainAspectRatio: false,
    ...weekChartOptions,
  };
  return (
    <div
      className="rounded-lg shadow-md p-4 bg-white"
      style={{ height: 400, overflowX: 'hidden' }}
    >
      <div className="flex justify-center items-center h-full">
        {dataGrafica ? (
          <Line data={dataGrafica} options={options} />
        ) : (
          <p>Cargando datos semanales...</p>
        )}
      </div>
    </div>
  );
};
export default GraficaSemanal;