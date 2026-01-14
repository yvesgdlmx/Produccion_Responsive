import ResumenResultado from "../models/ResumenResultado.js"
import { Op, where } from 'sequelize';

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

const obtenerPorcentajesMensuales = async (req, res) => {
    try {
        const { anio } = req.params;

        if(!anio) {
            return res.status(400).json({ error: "El año es requerido" });
        }

        //Obtener todos los registros del año
        const registros = await ResumenResultado.findAll({
            where: {
                diario: {
                    [Op.between]: [`${anio}-01-01`, `${anio}-12-31`]
                }
            },
            order: [['diario', 'ASC']]
        })

        //Agrupar por mes
        const datosPorMes = {};

        registros.forEach(registro => {
            const fechaString = registro.diario; // "2026-01-31"
            const [anioStr, mesStr, diaStr] = fechaString.split('-');
            const mes = parseInt(mesStr, 10); // 1, 2, 3... 12
            
            // Crear fecha correctamente para obtener el nombre del mes
            const fecha = new Date(`${fechaString}T00:00:00`);
            const nombreMes = fecha.toLocaleDateString('es-MX', { month: 'long'});
            const mesKey = `${anio}-${String(mes).padStart(2, '0')}`;

            if (!datosPorMes[mesKey]) {
                datosPorMes[mesKey] = {
                    mes: mes,
                    nombreMes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
                    anio: anio,
                    metaSF: 0,
                    metaF: 0,
                    realSF: 0,
                    realF: 0,
                    metaTotal: 0,
                    realTotal: 0,
                    porcentaje: 0,
                    registros: 0 
                }
            }

            // Sumar las metas y real (considerando null como 0)
            datosPorMes[mesKey].metaSF += registro.meta_sf || 0;
            datosPorMes[mesKey].metaF += registro.meta_f || 0;
            datosPorMes[mesKey].realSF += registro.real_sf || 0;
            datosPorMes[mesKey].realF += registro.real_f || 0;
            datosPorMes[mesKey].registros++; 
        })

        // Calcular totales y porcentajes
        const resultado = Object.values(datosPorMes).map(mes => {
            mes.metaTotal = mes.metaSF + mes.metaF;
            mes.realTotal = mes.realSF + mes.realF;

            // Calcular porcentaje
            if(mes.metaTotal > 0) {
                mes.porcentaje = ((mes.realTotal / mes.metaTotal) * 100).toFixed(2);
            } else {
                mes.porcentaje = 0;
            }

            // Calcular diferencia
            mes.diferencia = mes.realTotal - mes.metaTotal;

            return mes;
        })

        //Ordenar por mes
        resultado.sort((a, b) => a.mes - b.mes);

        res.json(resultado);
    } catch (error) {
        console.error("Error al obtener los porcentajes mensuales:", error);
        res.status(500).json({ error: "Error al obtener los porcentajes mensuales" });
    }
}

export { 
    obtenerResumenResultados,
    obtenerTodosLosRegistros,
    actualizarAsistencias,
    actualizarMetasDiarias,
    obtenerPorcentajesMensuales
}