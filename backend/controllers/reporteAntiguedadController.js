import { Op } from 'sequelize';
import Sequelize from 'sequelize';
import Antiguedad from '../models/ReporteAntiguedad.js';

const obtenerDatosAntiguedad = async (req, res) => {
    try {
        const { mes } = req.params;
        
        const registros = await Antiguedad.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('MONTH', Sequelize.col('today')), 
                        mes
                    )
                ]
            },
            order: [['enter_date', 'DESC']], 
            raw: true
        });

        if (!registros || registros.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron registros de antigüedad",
                debug: {
                    totalRegistros: await Antiguedad.count()
                }
            });
        }

        const registrosFormateados = registros.map(registro => ({
            ...registro,
            enter_date: new Date(registro.enter_date).toISOString().split('T')[0],
            today: new Date(registro.today).toISOString().split('T')[0]
        }));

        res.json({
            total: registrosFormateados.length,
            registros: registrosFormateados
        });
    } catch (error) {
        console.error("Error al obtener datos de antigüedad:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de antigüedad",
            error: error.message
        });
    }
};

export {
    obtenerDatosAntiguedad
};