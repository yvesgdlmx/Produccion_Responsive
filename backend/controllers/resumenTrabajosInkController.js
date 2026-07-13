import moment from "moment-timezone";
import ResumenTrabajosInk from "../models/ResumenTrabajosInk.js";

const obtenerDatosResumenTrabajosInk = async (req, res) => {
    try {
        const { anio, mes, dia } = req.params;

        if (!anio || !mes || !dia) {
            return res.status(400).json({
                msg: "Faltan parametros requeridos: anio, mes y dia",
                status: false
            });
        }

        const fechaBuscada = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

        if (!moment(fechaBuscada, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                msg: "Fecha invalida",
                status: false
            });
        }

        const registros = await ResumenTrabajosInk.findAll({
            where: {
                fecha_insercion: fechaBuscada
            },
            order: [["hora_insercion", "ASC"]],
            raw: true
        });

        if (registros.length === 0) {
            return res.status(404).json({
                msg: `No se encontraron registros para la fecha ${fechaBuscada}`,
                fecha: fechaBuscada,
                total: 0,
                status: false
            });
        }

        res.json({
            fecha: fechaBuscada,
            total: registros.length,
            registros,
            status: true
        });
    } catch (error) {
        console.error("Error al obtener datos de resumen trabajos Ink:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de resumen trabajos Ink",
            error: error.message,
            status: false
        });
    }
};

export {
    obtenerDatosResumenTrabajosInk
};
