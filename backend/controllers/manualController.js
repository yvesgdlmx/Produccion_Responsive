import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import Manual from "../models/Manual.js";
import moment from 'moment-timezone';

const obtenerRegistrosHoyYAyer = async (req, res) => {
    try {
        // Obtener la fecha actual y la fecha de ayer en la zona horaria de México
        const fechaHoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
        const fechaAyer = moment().tz('America/Mexico_City').subtract(1, 'days').format('YYYY-MM-DD');

        console.log(fechaHoy); // Fecha de hoy
        console.log(fechaAyer); // Fecha de ayer

        // Buscar registros de hoy y de ayer
        const registros = await Manual.findAll({
            where: {
                [Op.or]: [
                    {
                        fecha: {
                            [Op.gte]: new Date(`${fechaHoy}T00:00:00`),
                            [Op.lt]: new Date(`${fechaHoy}T23:59:59.999`)
                        }
                    },
                    {
                        fecha: {
                            [Op.gte]: new Date(`${fechaAyer}T00:00:00`),
                            [Op.lt]: new Date(`${fechaAyer}T23:59:59.999`)
                        }
                    }
                ]
            }
        });

        res.json({ registros });
    } catch (error) {
        console.error("Error al obtener los registros de hoy y ayer:", error);
        res.status(500).json({ error: "Error al obtener los registros de hoy y ayer" });
    }
}

const obtenerRegistrosPorFecha = async (req, res) => {
    try {
      // Extraer año, mes y día de los parámetros de la URL
      const { year, month, day } = req.params;
      // Construir la fecha seleccionada en formato "YYYY-MM-DD" usando moment en la zona horaria de México
      const fechaSeleccionada = moment
        .tz(`${year}-${month}-${day}`, "YYYY-M-D", "America/Mexico_City")
        .format("YYYY-MM-DD");
      console.log("Fecha seleccionada:", fechaSeleccionada);
      // Calcular la fecha del día anterior a la fecha seleccionada
      const fechaDiaAnterior = moment
        .tz(fechaSeleccionada, "YYYY-MM-DD", "America/Mexico_City")
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      console.log("Fecha del día anterior:", fechaDiaAnterior);
      // Definir rangos de tiempo para la fecha seleccionada y el día anterior
      const rangoFechaSeleccionada = {
        [Op.gte]: new Date(`${fechaSeleccionada}T00:00:00`),
        [Op.lt]: new Date(`${fechaSeleccionada}T23:59:59.999`)
      };
      const rangoFechaAnterior = {
        [Op.gte]: new Date(`${fechaDiaAnterior}T00:00:00`),
        [Op.lt]: new Date(`${fechaDiaAnterior}T23:59:59.999`)
      };
      // Definir patrones de búsqueda para el campo name
      const patron1 = "19 LENS LOG-SF%";
      const patron2 = "20 LENS LOG-FIN%";
      // Buscar registros que cumplan con:
      // 1. La fecha sea la seleccionada o el día anterior.
      // 2. El campo name comience con uno de los dos patrones.
      const registros = await Manual.findAll({
        where: {
          [Op.and]: [
            {
              name: {
                [Op.or]: [{ [Op.like]: patron1 }, { [Op.like]: patron2 }]
              }
            },
            {
              [Op.or]: [
                { fecha: rangoFechaSeleccionada },
                { fecha: rangoFechaAnterior }
              ]
            }
          ]
        }
      });
      res.json({ registros });
    } catch (error) {
      console.error("Error al obtener los registros con la fecha específica:", error);
      res.status(500).json({ error: "Error al obtener los registros con la fecha específica" });
    }
  };

  const obtenerRegistrosPorSemana = async (req, res) => {
  try {
    const { anio, semana } = req.params;
    
    // Validar que los parámetros sean números
    if (!Number(anio) || !Number(semana)) {
      return res.status(400).json({ error: "El año y la semana deben ser números" });
    }
    
    const lunesSemana = moment().year(Number(anio)).isoWeek(Number(semana)).startOf("isoWeek");
    const domingoSemana = lunesSemana.clone().endOf("isoWeek"); // domingo de la semana
    const diaAnterior = lunesSemana.clone().subtract(1, "day"); // domingo inmediatamente anterior
    
    // Convertir las fechas a formato "YYYY-MM-DD"
    const fechaDiaAnterior = diaAnterior.format("YYYY-MM-DD");
    const fechaInicioSemana = lunesSemana.format("YYYY-MM-DD");
    const fechaFinSemana = domingoSemana.format("YYYY-MM-DD");
    
    // Definir patrones de búsqueda para el campo "name"
    const patron1 = "19 LENS LOG-SF%";
    const patron2 = "20 LENS LOG-FIN%";
    
    const registros = await Manual.findAll({
      where: {
        [Op.and]: [
          {
            name: {
              [Op.or]: [
                { [Op.like]: patron1 },
                { [Op.like]: patron2 }
              ]
            }
          },
          {
            [Op.or]: [
              { fecha: fechaDiaAnterior },
              { fecha: { [Op.between]: [fechaInicioSemana, fechaFinSemana] } }
            ]
          }
        ]
      },
      order: [['fecha', 'ASC']]
    });
    
    res.json({ registros });
  
  } catch (error) {
    console.error("Error al obtener registros por semana:", error);
    res.status(500).json({
      error: "Error al obtener los registros por semana",
      detalles: error.message
    });
  }
};

const obtenerRegistrosJobCompleteSemana = async (req, res) => {
  try {
    const ahora = moment().tz('America/Mexico_City');

    // Calcular el sábado 22:00 de la semana correspondiente
    const sabadoEstaSemana = ahora.clone().startOf('week').add(6, 'days'); // sábado 00:00
    const sabadoEstaSemana22 = sabadoEstaSemana.clone().add(22, 'hours'); // sábado 22:00

    let inicioSemana;
    if (ahora.isBefore(sabadoEstaSemana22)) {
      inicioSemana = sabadoEstaSemana22.clone().subtract(1, 'week');
    } else {
      inicioSemana = sabadoEstaSemana22;
    }
    const finSemana = inicioSemana.clone().add(7, 'days').subtract(1, 'seconds'); // siguiente sábado 21:59:59

    // Construir literal que concatena fecha + hour (usa COALESCE para manejar nulls)
    const datetimeLiteral = Sequelize.literal("CAST(CONCAT(fecha, ' ', COALESCE(hour, '00:00:00')) AS DATETIME)");

    const registros = await Manual.findAll({
      where: {
        name: { [Op.like]: "32 JOB COMPLETE%" },
        [Op.and]: Sequelize.where(
          datetimeLiteral,
          {
            [Op.between]: [
              inicioSemana.format('YYYY-MM-DD HH:mm:ss'),
              finSemana.format('YYYY-MM-DD HH:mm:ss')
            ]
          }
        )
      },
      order: [['fecha', 'ASC']]
    });

    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener los registros de la semana laboral:", error);
    res.status(500).json({ error: "Error al obtener los registros de la semana laboral" });
  }
};

export {
    obtenerRegistrosHoyYAyer,
    obtenerRegistrosPorFecha,
    obtenerRegistrosPorSemana,
    obtenerRegistrosJobCompleteSemana
};