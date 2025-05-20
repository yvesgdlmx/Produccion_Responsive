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

export {
    obtenerRegistrosHoyYAyer,
    obtenerRegistrosPorFecha
}