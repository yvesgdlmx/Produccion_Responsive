import { Op, fn, col, literal } from 'sequelize';
import ReportesProduccion from '../models/ReportesProduccion.js';

const obtenerReportesProduccion = async (req, res) => {
    try {
        // Obtener la fecha y hora más reciente
        const ultimoRegistro = await ReportesProduccion.findOne({
            attributes: [
                'fecha_insercion',
                'hora_insercion'
            ],
            order: [
                ['fecha_insercion', 'DESC'],
                ['hora_insercion', 'DESC']
            ],
            raw: true
        });

        if (!ultimoRegistro) {
            return res.status(404).json({
                msg: "No se encontraron registros",
                debug: {
                    totalRegistros: await ReportesProduccion.count()
                }
            });
        }

        console.log('Último registro encontrado:', ultimoRegistro);

        // Obtener todos los registros con esa fecha y hora exacta
        const registros = await ReportesProduccion.findAll({
            where: {
                fecha_insercion: ultimoRegistro.fecha_insercion,
                hora_insercion: ultimoRegistro.hora_insercion
            },
            order: [['estacion', 'ASC']]
        });

        console.log('Número de registros encontrados:', registros.length);

        res.json({
            total: registros.length,
            fecha_consulta: `${ultimoRegistro.fecha_insercion} ${ultimoRegistro.hora_insercion}`,
            registros
        });
    } catch (error) {
        console.error("Error al obtener reportes de producción:", error);
        res.status(500).json({
            msg: "Error al obtener los reportes de producción",
            error: error.message
        });
    }
};

export {
    obtenerReportesProduccion
};