import moment from 'moment-timezone';
import WipOperacionResumen from '../models/WipOperacionResumen.js';
import { Op } from 'sequelize';

const obtenerWipPorFechaInsercion = async (req, res) => {
    try {
        const { anio, mes, dia } = req.params;

        if (!anio || !mes || !dia) {
            return res.status(400).json({
                msg: 'Faltan parámetros requeridos: año, mes y día'
            });
        }

        const fechaBuscada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

        if (!moment(fechaBuscada, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({
                msg: 'Fecha inválida'
            });
        }

        const registros = await WipOperacionResumen.findAll({
            where: {
                fecha_insercion: fechaBuscada
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
            registros
        });

    } catch (error) {
        console.error('Error al obtener WIP operación resumen:', error);
        res.status(500).json({
            msg: 'Error al obtener WIP operación resumen',
            error: error.message
        });
    }
};

export {
    obtenerWipPorFechaInsercion
};
