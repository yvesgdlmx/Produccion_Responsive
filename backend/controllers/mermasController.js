import { Op } from "sequelize";
import moment from "moment-timezone";
import ConteoMermas from "../models/mermas/ConteoMermas.js";
import Manual from "../models/Manual.js";
import RazonesDeMerma from "../models/mermas/RazonesDeMerma.js";
const obtenerRegistrosConteoMermasHoyYAyer = async (req, res) => {
  try {
    // Obtener la fecha actual y la fecha de ayer en la zona horaria de México
    const fechaHoy = moment().tz("America/Mexico_City").format("YYYY-MM-DD");
    const fechaAyer = moment().tz("America/Mexico_City").subtract(1, "days").format("YYYY-MM-DD");
    console.log("Fecha de hoy:", fechaHoy);
    console.log("Fecha de ayer:", fechaAyer);
    // Buscar registros de hoy y de ayer (rango completo de cada día)
    const registros = await ConteoMermas.findAll({
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
    console.error("Error al obtener registros de ConteoMermas:", error);
    res.status(500).json({ error: "Error al obtener los registros de conteo mermas" });
  }
};
const obtenerRegistrosManualHoyYAyer = async (req, res) => {
  try {
    // Obtener la fecha de hoy y de ayer en la zona horaria de México
    const fechaHoy = moment().tz("America/Mexico_City").format("YYYY-MM-DD");
    const fechaAyer = moment().tz("America/Mexico_City").subtract(1, "days").format("YYYY-MM-DD");
    console.log("Fecha de hoy:", fechaHoy);
    console.log("Fecha de ayer:", fechaAyer);
    // Buscar registros de hoy y de ayer y filtrar además por name
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
        ],
        name: {
          [Op.like]: "32 JOB COMPLETE%"
        }
      }
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de Manual:", error);
    res.status(500).json({ error: "Error al obtener los registros del modelo Manual" });
  }
};
const obtenerRegistrosRazonesMermasHoyYAyer = async (req, res) => {
  try {
    // Obtener la fecha de hoy y de ayer en la zona horaria de México
    const fechaHoy = moment().tz("America/Mexico_City").format("YYYY-MM-DD");
    const fechaAyer = moment().tz("America/Mexico_City").subtract(1, "days").format("YYYY-MM-DD");
    console.log("Fecha de hoy:", fechaHoy);
    console.log("Fecha de ayer:", fechaAyer);
    // Buscar registros de hoy y de ayer
    const registros = await RazonesDeMerma.findAll({
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
    console.error("Error al obtener registros de Razones de Merma:", error);
    res.status(500).json({ error: "Error al obtener los registros de razones de merma" });
  }
};
export { 
  obtenerRegistrosConteoMermasHoyYAyer, 
  obtenerRegistrosManualHoyYAyer, 
  obtenerRegistrosRazonesMermasHoyYAyer 
};