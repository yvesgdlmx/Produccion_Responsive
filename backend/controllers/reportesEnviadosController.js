import moment from 'moment-timezone';
import ReportesEnviados from '../models/ReportesEnviados.js';
import { Op } from "sequelize";

const obtenerDatosReportesEnviados = async (req, res) => {
    try {
        // Encuentra la fecha más reciente en la base de datos
        const fechaMasReciente = await ReportesEnviados.max('fecha');
        console.log("Fecha más reciente encontrada en bruto:", fechaMasReciente);

        if (!fechaMasReciente) {
            return res.status(404).json({
                msg: "No se encontraron registros de reportes enviados",
                debug: { totalRegistros: await ReportesEnviados.count() }
            });
        }

        // Ajustar la fecha para evitar problemas de zona horaria
        const fechaFormateada = moment(fechaMasReciente).format('YYYY-MM-DD');
        console.log("Fecha ajustada para la consulta:", fechaFormateada);

        // Consultar por el rango del día completo
        const registros = await ReportesEnviados.findAll({
            where: {
                fecha: {
                    [Op.gte]: new Date(`${fechaFormateada}T00:00:00Z`),
                    [Op.lt]: new Date(`${fechaFormateada}T23:59:59.999Z`)
                }
            },
            order: [['id', 'ASC']],
            raw: true
        });

        res.json({
            total: registros.length,
            registros: registros
        });
    } catch (error) {
        console.error("Error al obtener datos de reportes enviados:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de reportes enviados",
            error: error.message
        });
    }
};

export { obtenerDatosReportesEnviados };
