import { Op } from "sequelize"; 
import WipTotal from "../models/WipTotal.js"; 
import moment from 'moment-timezone'; 
import RazonesCancelados from "../models/RazonesCancelados.js";

const obtenerWipTotal = async (req, res) => { 
    const { anio, mes, dia } = req.params; // Obtener año, mes y día de los parámetros de la URL 
    try { 
        // Crear la fecha en formato 'YYYY-MM-DD' sin la hora
        const fechaConsultaInicio = moment.tz(`${anio}-${mes}-${dia}`, 'America/Mexico_City').startOf('day').toDate();
        const fechaConsultaFin = moment.tz(`${anio}-${mes}-${dia}`, 'America/Mexico_City').endOf('day').toDate();

        console.log("Fecha a consultar inicio:", fechaConsultaInicio); // Debugging
        console.log("Fecha a consultar fin:", fechaConsultaFin); // Debugging

        // Obtener registros de la tabla WipTotal que coincidan con la fecha
        const registrosModelo = await WipTotal.findAll({ 
            where: { 
                fecha: { 
                    [Op.gte]: fechaConsultaInicio, // Mayor o igual que el inicio del día
                    [Op.lt]: fechaConsultaFin // Menor que el final del día
                } 
            } 
        }); 
        
        // Verificar si se encontraron registros 
        if (registrosModelo.length === 0) { 
            return res.status(404).json({ message: "No se encontraron registros para la fecha proporcionada." }); 
        } 
        
        // Formatear la fecha de cada registro 
        const registrosFormateados = registrosModelo.map((registro) => { 
            return { 
                ...registro.toJSON(), 
                fecha: moment(registro.fecha).tz('America/Mexico_City').format('YYYY-MM-DD') // Solo la fecha sin hora
            }; 
        }); 
        
        res.json({ registros: registrosFormateados }); 
    } catch (error) { 
        console.error("Error al obtener los registros por fecha:", error); 
        res.status(500).json({ error: "Error al obtener los registros por fecha" }); 
    } 
} 

const obtenerRazones = async (req, res) => {
    const { anio, mes, dia } = req.params;

      // Crear fecha en formato YYYY-MM-DD y convertir a UTC
      const fechaBusqueda = moment.tz(`${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`, 'America/Mexico_City').utc();

      // Definir el inicio y fin del día en UTC
      const inicioDia = fechaBusqueda.clone().startOf('day');
      const finDia = fechaBusqueda.clone().endOf('day');

       // Consultar ResumenNvi
       const razones = await RazonesCancelados.findAll({
            where: {
                fecha: {
                    [Op.between]: [inicioDia.toDate(), finDia.toDate()]
                }
            }
        });

         // Preparar respuesta
         const respuesta = {
            fecha: fechaBusqueda.format('YYYY-MM-DD'),
            resumenDia: razones || null,
            status: true
        };

        // Si no hay datos, enviar mensaje específico
        if (!razones.length) {
            return res.status(404).json({
                msg: 'No se encontraron datos para la fecha especificada',
                status: false
            });
        }

         // Enviar respuesta
         res.json(respuesta);
}

const obtenerWipTotalPorRango = async (req, res) => {
    const { anioInicio, mesInicio, diaInicio, anioFin, mesFin, diaFin } = req.params;
    try {
        // Crear fechas de inicio y fin en formato 'YYYY-MM-DD'
        const fechaInicio = moment(`${anioInicio}-${mesInicio}-${diaInicio}`).startOf('day').toDate();
        const fechaFin = moment(`${anioFin}-${mesFin}-${diaFin}`).endOf('day').toDate();

        // Buscar registros en el rango
        const registros = await WipTotal.findAll({
            where: {
                fecha: {
                    [Op.gte]: fechaInicio,
                    [Op.lte]: fechaFin
                }
            }
        });

        if (!registros.length) {
            return res.status(404).json({ message: "No se encontraron registros en el rango de fechas." });
        }

        // Formatear fechas
        const registrosFormateados = registros.map(registro => ({
            ...registro.toJSON(),
            fecha: moment(registro.fecha).format('YYYY-MM-DD')
        }));

        res.json({ registros: registrosFormateados });
    } catch (error) {
        console.error("Error al obtener registros por rango:", error);
        res.status(500).json({ error: "Error al obtener registros por rango de fechas" });
    }
};

export { 
    obtenerWipTotal, 
    obtenerRazones,
    obtenerWipTotalPorRango
}