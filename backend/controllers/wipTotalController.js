import { Op } from "sequelize"; 
import WipTotal from "../models/WipTotal.js"; 
import moment from 'moment-timezone'; 

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

export { 
    obtenerWipTotal 
}