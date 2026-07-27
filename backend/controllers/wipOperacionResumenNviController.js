import moment from 'moment-timezone';
import WipOperacionResumenNvi from '../models/WipOperacionResumenNvi.js';

const obtenerWipNviPorFechaInsercion = async (req, res) => {
    try {
        const { anio, mes, dia } = req.params;

        if (!anio || !mes || !dia) {
            return res.status(400).json({
                msg: 'Faltan parametros requeridos: anio, mes y dia'
            });
        }

        const fechaBuscada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

        if (!moment(fechaBuscada, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({
                msg: 'Fecha invalida'
            });
        }

        const registros = await WipOperacionResumenNvi.findAll({
            where: {
                fecha_insercion: fechaBuscada
            },
            order: [['hora_insercion', 'ASC']],
            raw: true
        });

        if (registros.length === 0) {
            return res.status(404).json({
                msg: `No se encontraron registros NVI para la fecha ${fechaBuscada}`,
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
        console.error('Error al obtener WIP operacion resumen NVI:', error);
        res.status(500).json({
            msg: 'Error al obtener WIP operacion resumen NVI',
            error: error.message
        });
    }
};

export {
    obtenerWipNviPorFechaInsercion
};
