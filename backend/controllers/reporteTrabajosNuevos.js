import moment from 'moment-timezone';
import TrabajosNuevos from '../models/TrabajosNuevos.js';
import { Op } from "sequelize";

const obtenerDatosTrabajosNuevos = async (req, res) => {
    try {
        // Encuentra la fecha más reciente en la base de datos
        const fechaMasReciente = await TrabajosNuevos.max('fecha');
        console.log("Fecha más reciente encontrada en bruto:", fechaMasReciente);

        if (!fechaMasReciente) {
            return res.status(404).json({
                msg: "No se encontraron registros de trabajos nuevos",
                debug: {
                    totalRegistros: await TrabajosNuevos.count()
                }
            });
        }

        // Convierte la fecha a la zona horaria de México y formatea
        const fechaFormateada = moment(fechaMasReciente).format('YYYY-MM-DD');
        console.log("Fecha formateada para la consulta:", fechaFormateada);

        // Obtén todos los registros con la fecha más reciente
        const registros = await TrabajosNuevos.findAll({
            where: {
                fecha: {
                    [Op.gte]: new Date(`${fechaFormateada}T00:00:00`),
                    [Op.lt]: new Date(`${fechaFormateada}T23:59:59.999`)
                }
            },
            order: [['hora', 'ASC']],
            raw: true
        });

        res.json({
            total: registros.length,
            registros: registros
        });
    } catch (error) {
        console.error("Error al obtener datos de trabajos nuevos:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de trabajos nuevos",
            error: error.message
        });
    }
};

export {
    obtenerDatosTrabajosNuevos
};