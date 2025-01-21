import moment from 'moment-timezone';
import ReportesResumenComp from '../models/ReportesResumenComp.js';
import { Op } from 'sequelize';

const obtenerDatosNvi = async (req, res) => {
    try {
        const { anio, mes, dia } = req.params;
        // Crear fecha en formato YYYY-MM-DD y convertir a UTC
        const fechaBusqueda = moment.tz(`${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`, 'America/Mexico_City').utc();

        // Definir el inicio y fin del día en UTC
        const inicioDia = fechaBusqueda.clone().startOf('day');
        const finDia = fechaBusqueda.clone().endOf('day');


        // Consultar ResumenNvi
        const resumen = await ReportesResumenComp.findAll({
            where: {
                fecha_insercion: {
                    [Op.between]: [inicioDia.toDate(), finDia.toDate()]
                }
            }
        });

        // Preparar respuesta
        const respuesta = {
            fecha: fechaBusqueda.format('YYYY-MM-DD'),
            resumenDia: resumen || null,
            status: true
        };

        // Si no hay datos, enviar mensaje específico
        if (!resumen.length) {
            return res.status(404).json({
                msg: 'No se encontraron datos para la fecha especificada',
                status: false
            });
        }

        // Enviar respuesta
        res.json(respuesta);
    } catch (error) {
        console.log("Error al obtener datos NVI:", error);
        res.status(500).json({
            msg: 'Hubo un error al obtener los datos',
            status: false
        });
    }
};

export {
    obtenerDatosNvi,
};