import moment from 'moment-timezone';
import ResumenArTrabajos from '../models/ResumenArTrabajos.js';
import { Op } from "sequelize";

const obtenerDatosResumenArTrabajos = async (req, res) => {
    try {
        // Cambiar año por anio para coincidir con la ruta
        const { anio, mes, dia } = req.params;

        // Validar que se proporcionen los parámetros necesarios
        if (!anio || !mes || !dia) {
            return res.status(400).json({
                msg: "Faltan parámetros requeridos: año, mes y día"
            });
        }

        // Construir la fecha con los parámetros recibidos
        const fechaBuscada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        console.log("Fecha a buscar:", fechaBuscada);

        // Validar que la fecha sea válida
        if (!moment(fechaBuscada, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({
                msg: "Fecha inválida"
            });
        }

        // Obtener los registros de la fecha específica
        const registros = await ResumenArTrabajos.findAll({
            where: {
                fecha_insercion: {
                    [Op.gte]: new Date(`${fechaBuscada}T00:00:00`),
                    [Op.lt]: new Date(`${fechaBuscada}T23:59:59.999`)
                }
            },
            order: [['hora_insercion', 'ASC']],
            raw: true
        });

        if (registros.length === 0) {
            return res.status(404).json({
                msg: `No se encontraron registros para la fecha ${fechaBuscada}`,
                fecha: fechaBuscada,
                total: 0
            });
        }

        res.json({
            fecha: fechaBuscada,
            total: registros.length,
            registros: registros
        });

    } catch (error) {
        console.error("Error al obtener datos de resumen AR trabajos:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de resumen AR trabajos",
            error: error.message
        });
    }
};

export {
    obtenerDatosResumenArTrabajos
};