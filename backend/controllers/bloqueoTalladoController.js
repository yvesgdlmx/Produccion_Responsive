import { Sequelize } from "sequelize";
import BloqueoDeTallado from "../models/BloqueoDeTallado.js";
import { Op } from "sequelize";
import moment from 'moment-timezone';

const obtenerRegistrosHoyYAyer = async (req, res) => {
    try {
        // Obtener la fecha actual y la fecha de ayer en la zona horaria de México
        const fechaHoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
        const fechaAyer = moment().tz('America/Mexico_City').subtract(1, 'days').format('YYYY-MM-DD');

        console.log(fechaHoy); // Fecha de hoy
        console.log(fechaAyer); // Fecha de ayer

        // Buscar registros de hoy y de ayer
        const registros = await BloqueoDeTallado.findAll({
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

export {
    obtenerRegistrosHoyYAyer
}