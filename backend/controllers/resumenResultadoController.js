import ResumenResultado from "../models/ResumenResultado.js"
import { Op } from 'sequelize';

const obtenerResumenResultados = async (req, res) => {
    try {
        const { anio } = req.params;
        
        let whereClause = {};
        
        // Si se proporciona un año, filtrar por ese año
        if (anio) {
            whereClause = {
                diario: {
                    [Op.between]: [`${anio}-01-01`, `${anio}-12-31`]
                }
            };
        }
        
        const registros = await ResumenResultado.findAll({
            where: whereClause,
            order: [['diario', 'ASC']]
        });
        
        res.json(registros);
    } catch (error) {
        console.error("Error al obtener los registros de ResumenResultado:", error);
        res.status(500).json({ error: "Error al obtener los registros de ResumenResultado" });
    }
};

const obtenerTodosLosRegistros = async (req, res) => {
    try {
        const { anio } = req.params;
        
        let whereClause = {};
        
        if (anio) {
            whereClause = {
                diario: {
                    [Op.between]: [`${anio}-01-01`, `${anio}-12-31`]
                }
            };
        }
        
        const registros = await ResumenResultado.findAll({
            where: whereClause,
            order: [['diario', 'ASC']]
        });
        
        res.json(registros);
    } catch (error) {
        console.error("Error al obtener los registros de ResumenResultado:", error);
        res.status(500).json({ error: "Error al obtener los registros de ResumenResultado" });
    }
}

const actualizarAsistencias = async (req, res) => {
    const asistencias = req.body;

    try {
        const resultados = [];

        for (const item of asistencias) {
            const registro = await ResumenResultado.findByPk(item.id);
            
            if (!registro) {
                continue;
            }

            const datosActualizar = {};
            
            if (item.asistencia_nocturno !== undefined) {
                datosActualizar.asistencia_nocturno = item.asistencia_nocturno;
            }
            if (item.asistencia_mat !== undefined) {
                datosActualizar.asistencia_mat = item.asistencia_mat;
            }
            if (item.asistencia_vesp !== undefined) {
                datosActualizar.asistencia_vesp = item.asistencia_vesp;
            }

            await registro.update(datosActualizar);
            resultados.push(registro);
        }

        res.json({ 
            msg: 'Asistencias actualizadas correctamente',
            registros: resultados 
        });
    } catch (error) {
        console.error('Error al actualizar asistencias:', error);
        res.status(500).json({ 
            error: 'Error al actualizar las asistencias',
            detalle: error.message 
        });
    }
};

const actualizarMetasDiarias = async (req, res) => {
    const metas = req.body;

    try {
        console.log('📥 Payload recibido en backend:', metas);
        
        const resultados = [];

        for (const item of metas) {
            const registro = await ResumenResultado.findByPk(item.id);
            
            if (!registro) {
                console.log(`❌ No se encontró registro con ID: ${item.id}`);
                continue;
            }

            const datosActualizar = {};
            
            if (item.meta_sf !== undefined) {
                datosActualizar.meta_sf = item.meta_sf;
            }
            if (item.meta_f !== undefined) {
                datosActualizar.meta_f = item.meta_f;
            }
            if (item.fact_proyect !== undefined) { // ⬅️ CAMBIO AQUÍ
                datosActualizar.fact_proyect = item.fact_proyect; // ⬅️ CAMBIO AQUÍ
            }

            console.log(`📝 Actualizando registro ${item.id} con:`, datosActualizar);
            
            await registro.update(datosActualizar);
            resultados.push(registro);
        }

        console.log(`✅ Se actualizaron ${resultados.length} registros`);

        res.json({ 
            msg: 'Metas diarias actualizadas correctamente',
            registros: resultados 
        });
    } catch (error) {
        console.error('❌ Error al actualizar metas diarias:', error);
        res.status(500).json({ 
            error: 'Error al actualizar las metas diarias',
            detalle: error.message 
        });
    }
};

export { 
    obtenerResumenResultados,
    obtenerTodosLosRegistros,
    actualizarAsistencias,
    actualizarMetasDiarias
}