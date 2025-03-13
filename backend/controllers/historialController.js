import { Sequelize } from "sequelize";
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import BloqueoDeTallado from "../models/BloqueoDeTallado.js";
import Generadores from "../models/Generadores.js";
import Pulido from "../models/Pulido.js";
import Engraver from "../models/Engraver.js";
import BloqueoDeTerminado from "../models/BloqueoDeTerminado.js";
import Biselado from "../models/Biselado.js";
import Manual from "../models/Manual.js";

const modelos = [
    BloqueoDeTallado,
    Generadores,
    Pulido,
    Engraver,
    BloqueoDeTerminado,
    Biselado,
    Manual
];

const obtenerRegistros = async (req, res) => {
    const { nombreModelo, anio, mes, dia, rangoHora } = req.params;
    const Modelo = modelos[nombreModelo];

    if(!Modelo) {
        return res.status(400).json({ error: 'Modelo no Encontrado'});
    }
    let horaInicio, horaFin;

    // Determinar el rango de horas
    switch (rangoHora) {
        case '06:00:00-06:30:00':
            horaInicio = '06:00:00';
            horaFin = '06:30:00';
            break;
        case '06:30:00-07:00:00':
            horaInicio = '06:30:00';
            horaFin = '07:00:00';
            break;
        case '07:00:00-07:30:00':
            horaInicio = '07:00:00';
            horaFin = '07:30:00';
            break;
        case '07:30:00-08:00:00':
            horaInicio = '07:30:00';
            horaFin = '08:00:00';
            break;
        case '08:00:00-08:30:00':
            horaInicio = '08:00:00';
            horaFin = '08:30:00';
            break;
        case '08:30:00-09:00:00':
            horaInicio = '08:30:00';
            horaFin = '09:00:00';
            break;
        case '09:00:00-09:30:00':
            horaInicio = '09:00:00';
            horaFin = '09:30:00';
            break;
        case '09:30:00-10:00:00':
            horaInicio = '09:30:00';
            horaFin = '10:00:00';
            break;
        case '10:00:00-10:30:00':
            horaInicio = '10:00:00';
            horaFin = '10:30:00';
            break;
        case '10:30:00-11:00:00':
            horaInicio = '10:30:00';
            horaFin = '11:00:00';
            break;
        case '11:00:00-11:30:00':
            horaInicio = '11:00:00';
            horaFin = '11:30:00';
            break;
        case '11:30:00-12:00:00':
            horaInicio = '11:30:00';
            horaFin = '12:00:00';
            break;
        case '12:00:00-12:30:00':
            horaInicio = '12:00:00';
            horaFin = '12:30:00';
            break;
        case '12:30:00-13:00:00':
            horaInicio = '12:30:00';
            horaFin = '13:00:00';
            break;
        case '13:00:00-13:30:00':
            horaInicio = '13:00:00';
            horaFin = '13:30:00';
            break;
        case '13:30:00-14:00:00':
            horaInicio = '13:30:00';
            horaFin = '14:00:00';
            break;
        case '14:00:00-14:30:00':
            horaInicio = '14:00:00';
            horaFin = '14:30:00';
            break;
        case '14:30:00-15:00:00':
            horaInicio = '14:30:00';
            horaFin = '15:00:00';
            break;
        case '15:00:00-15:30:00':
            horaInicio = '15:00:00';
            horaFin = '15:30:00';
            break;
        case '15:30:00-16:00:00':
            horaInicio = '15:30:00';
            horaFin = '16:00:00';
            break;
        case '16:00:00-16:30:00':
            horaInicio = '16:00:00';
            horaFin = '16:30:00';
            break;
        case '16:30:00-17:00:00':
            horaInicio = '16:30:00';
            horaFin = '17:00:00';
            break;
        case '17:00:00-17:30:00':
            horaInicio = '17:00:00';
            horaFin = '17:30:00';
            break;
        case '17:30:00-18:00:00':
            horaInicio = '17:30:00';
            horaFin = '18:00:00';
            break;
        case '18:00:00-18:30:00':
            horaInicio = '18:00:00';
            horaFin = '18:30:00';
            break;
        case '18:30:00-19:00:00':
            horaInicio = '18:30:00';
            horaFin = '19:00:00';
            break;
        case '19:00:00-19:30:00':
            horaInicio = '19:00:00';
            horaFin = '19:30:00';
            break;
        case '19:30:00-20:00:00':
            horaInicio = '19:30:00';
            horaFin = '20:00:00';
            break;
        case '20:00:00-20:30:00':
            horaInicio = '20:00:00';
            horaFin = '20:30:00';
            break;
        case '20:30:00-21:00:00':
            horaInicio = '20:30:00';
            horaFin = '21:00:00';
            break;
        case '21:00:00-21:30:00':
            horaInicio = '21:00:00';
            horaFin = '21:30:00';
            break;
        case '21:30:00-22:00:00':
            horaInicio = '21:30:00';
            horaFin = '22:00:00';
            break;
        case '22:00:00-22:30:00':
            horaInicio = '22:00:00';
            horaFin = '22:30:00';
            break;
        case '22:30:00-23:00:00':
            horaInicio = '22:30:00';
            horaFin = '23:00:00';
            break;
        case '23:00:00-23:30:00':
            horaInicio = '23:00:00';
            horaFin = '23:30:00';
            break;
        case '23:30:00-24:00:00':
            horaInicio = '23:30:00';
            horaFin = '24:00:00';
            break;
        case '24:00:00-24:30:00':
            horaInicio = '24:00:00';
            horaFin = '24:30:00';
            break;
        case '24:30:00-01:00:00':
            horaInicio = '24:30:00';
            horaFin = '1:00:00';
            break;
        case '01:00:00-01:30:00':
            horaInicio = '01:00:00';
            horaFin = '01:30:00';
            break;
        case '01:30:00-02:00:00':
            horaInicio = '01:30:00';
            horaFin = '02:00:00';
            break;
        case '02:00:00-02:30:00':
            horaInicio = '02:00:00';
            horaFin = '02:30:00';
            break;
        case '02:30:00-03:00:00':
            horaInicio = '01:00:00';
            horaFin = '01:30:00';
            break;
        case '03:00:00-03:30:00':
            horaInicio = '03:00:00';
            horaFin = '03:30:00';
            break;
        default:
            // Manejar un rango de horas inválido si es necesario
            break;
    }

    // Filtrar por hora en un rango específico
    const registros = await Modelo.findAll({
        where: {
            [Sequelize.Op.and]: [
                {
                    fecha: {
                        [Sequelize.Op.and]: [
                            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), anio),
                            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), mes),
                            Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fecha')), dia),
                        ]
                    }
                },
                Sequelize.literal(`TIME(hour) BETWEEN '${horaInicio}' AND '${horaFin}'`)
            ]
        }
    });

    // Formatear la fecha de cada registro y extraer el nombre adecuadamente
    const registrosFormateados = registros.map((registro) => {
        // Dividir el nombre por el guion y tomar la primera parte
        const nombreParts = registro.name.split('-');
        const nombre = nombreParts.length > 1 ? nombreParts[0].trim() : registro.name;
        return {
            ...registro.toJSON(),
            fecha: registro.fecha.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
            name: nombre
        };
    });

    res.json({ registrosFormateados });
}

const obtenerRegistrosTurnos = async (req, res) => {
  const { anio, mes, dia } = req.params;
  try {
    // Objeto para almacenar los registros agrupados por modelo
    const registrosPorModelo = {};
    // Arreglos para almacenar por separado los registros especiales de "surtido", "produccion", "AR" y "Desbloqueo"
    let surtido = [];
    let produccion = [];
    let ar = [];
    let desbloqueo = [];
    // Calcular el rango del día solicitado utilizando la zona horaria de México
    const fechaInicio = moment(`${anio}-${mes}-${dia} 00:00:00`, "YYYY-MM-DD HH:mm:ss");
    const fechaFin = moment(fechaInicio).add(1, "days").startOf("day");
    // Iterar sobre cada modelo
    for (const Modelo of modelos) {
      // Obtener únicamente los registros del día solicitado
      const registrosModelo = await Modelo.findAll({
        where: {
          fecha: {
            [Op.gte]: fechaInicio.toDate(),
            [Op.lt]: fechaFin.toDate(),
          },
        },
      });
      // Mapear cada registro para formatear la fecha y obtener el nombre adecuado
      const registrosFormateados = registrosModelo.map((registro) => {
        const nombreParts = registro.name.split("-");
        const nombre = nombreParts.length > 1 ? nombreParts[0].trim() : registro.name;
        return {
          ...registro.toJSON(),
          // Se formatea la fecha utilizando la zona horaria de México
          fecha: moment(registro.fecha).format("YYYY-MM-DD HH:mm:ss"),
          name: nombre,
        };
      });
      // Si el modelo es "manuales", se separan los registros especiales
      if (Modelo.name === "manuales") {
        // Registros para "surtido": casos con name "19 LENS LOG" o "20 LENS LOG"
        const registrosSurtido = registrosFormateados.filter(
          (registro) =>
            registro.name === "19 LENS LOG" || registro.name === "20 LENS LOG"
        );
        // Registros para "produccion": casos con name "32 JOB COMPLETE"
        const registrosProduccion = registrosFormateados.filter(
          (registro) => registro.name === "32 JOB COMPLETE"
        );
        // Registros para "AR": casos con name "91 VELOCITY 1", "92 VELOCITY 2", "52 FUSION", "53 1200 D", "55 TLF 1200.1" o "56 TLF 1200.2"
        const registrosAR = registrosFormateados.filter((registro) =>
          [
            "91 VELOCITY 1",
            "92 VELOCITY 2",
            "52 FUSION",
            "53 1200 D",
            "55 TLF 1200.1",
            "56 TLF 1200.2",
          ].includes(registro.name)
        );
        // Registros para "Desbloqueo": casos con name "320 DEBLOCKING 1"
        const registrosDesbloqueo = registrosFormateados.filter(
          (registro) => registro.name === "320 DEBLOCKING 1"
        );
        // Los demás registros se mantienen en "manuales"
        const registrosManuales = registrosFormateados.filter(
          (registro) =>
            registro.name !== "19 LENS LOG" &&
            registro.name !== "20 LENS LOG" &&
            registro.name !== "32 JOB COMPLETE" &&
            ![
              "91 VELOCITY 1",
              "92 VELOCITY 2",
              "52 FUSION",
              "53 1200 D",
              "55 TLF 1200.1",
              "56 TLF 1200.2",
            ].includes(registro.name) &&
            registro.name !== "320 DEBLOCKING 1"
        );
        registrosPorModelo[Modelo.name] = registrosManuales;
        surtido.push(...registrosSurtido);
        produccion.push(...registrosProduccion);
        ar.push(...registrosAR);
        desbloqueo.push(...registrosDesbloqueo);
      } else {
        // Para los demás modelos, se asignan los registros obtenidos sin modificación de orden
        registrosPorModelo[Modelo.name] = registrosFormateados;
      }
    }
    // Agregar las secciones "surtido", "produccion", "AR" y "Desbloqueo" a la respuesta, si existen registros en ellas
    if (surtido.length > 0) {
      registrosPorModelo["surtido"] = surtido;
    }
    if (produccion.length > 0) {
      registrosPorModelo["produccion"] = produccion;
    }
    if (ar.length > 0) {
      registrosPorModelo["AR"] = ar;
    }
    if (desbloqueo.length > 0) {
      registrosPorModelo["Desbloqueo"] = desbloqueo;
    }
    res.json({ registros: registrosPorModelo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
};
export default obtenerRegistrosTurnos;

/*const obtenerRegistrosTurnos = async (req, res) => {
    const { nombreModelo, anio, mes, dia } = req.params;
    const Modelo = modelos[nombreModelo];
    if (!Modelo) {
        return res.status(400).json({ error: 'Modelo no Encontrado' });
    }

    let registros;
    // Obtener registros sin filtrar por rango de horas
    registros = await Modelo.findAll({
        where: {
            [Sequelize.Op.and]: [
                {
                    fecha: {
                        [Sequelize.Op.and]: [
                            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), anio),
                            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), mes),
                            Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fecha')), dia),
                        ]
                    }
                }
            ]
        }
    });

    // Formatear la fecha de cada registro y extraer el nombre adecuadamente
    const registrosFormateados = registros.map((registro) => {
        // Dividir el nombre por el guion y tomar la primera parte
        const nombreParts = registro.name.split('-');
        const nombre = nombreParts.length > 1 ? nombreParts[0].trim() : registro.name;
        return {
            ...registro.toJSON(),
            fecha: registro.fecha.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
            name: nombre
        };
    });

    res.json({ registrosFormateados });
}*/

const obtenerRegistrosTurnosRangos = async (req, res) => {
  const { anioInicio, mesInicio, diaInicio, anioFin, mesFin, diaFin } = req.params;
  // Armamos las fechas de consulta en formato "YYYY-MM-DD" y ajustamos para incluir el día completo
  const fechaInicioConsulta = `${anioInicio}-${mesInicio.padStart(2, "0")}-${diaInicio.padStart(2, "0")}T00:00:00`;
  const fechaFinConsulta = `${anioFin}-${mesFin.padStart(2, "0")}-${diaFin.padStart(2, "0")}T23:59:59`;
  
  try {
    // Objeto para almacenar los registros agrupados por modelo
    const registrosPorModelo = {};
    // Arreglos para almacenar registros especiales del modelo "manuales"
    let surtido = [];
    let produccion = [];
    let ar = [];
    let desbloqueo = [];
    
    // Iterar sobre cada modelo (suponiendo que 'modelos' es un arreglo de modelos de Sequelize)
    for (const Modelo of modelos) {
      const registrosModelo = await Modelo.findAll({
        where: {
          fecha: {
            [Op.between]: [new Date(fechaInicioConsulta), new Date(fechaFinConsulta)]
          }
        }
      });
      // Formatear cada registro:
      // • Se formatea la fecha usando el formato correcto ("YYYY-MM-DD")
      // • Se obtiene el nombre “limpio” (se separa por el guión si fuera necesario)
      const registrosFormateados = registrosModelo.map((registro) => {
        const nombreParts = registro.name.split("-");
        const nombre = (nombreParts.length > 1) ? nombreParts[0].trim() : registro.name;
        return {
          ...registro.toJSON(),
          // Formateamos la fecha usando moment y la zona horaria deseada
          fecha: moment(registro.fecha).format("YYYY-MM-DD"),
          name: nombre
        };
      });
      
      // En el caso del modelo "manuales", se hacen agrupaciones especiales
      if (Modelo.name === "manuales") {
        const registrosSurtido = registrosFormateados.filter(
          registro => registro.name === "19 LENS LOG" || registro.name === "20 LENS LOG"
        );
        const registrosProduccion = registrosFormateados.filter(
          registro => registro.name === "32 JOB COMPLETE"
        );
        const registrosAR = registrosFormateados.filter(
          registro => ["91 VELOCITY 1", "92 VELOCITY 2", "52 FUSION", "53 1200 D", "55 TLF 1200.1", "56 TLF 1200.2"].includes(registro.name)
        );
        const registrosDesbloqueo = registrosFormateados.filter(
          registro => registro.name === "320 DEBLOCKING 1"
        );
        // Los restantes se consideran registros "manuales" propiamente dichos
        registrosPorModelo[Modelo.name] = registrosFormateados.filter(
          registro => 
            registro.name !== "19 LENS LOG" &&
            registro.name !== "20 LENS LOG" &&
            registro.name !== "32 JOB COMPLETE" &&
            !["91 VELOCITY 1", "92 VELOCITY 2", "52 FUSION", "53 1200 D", "55 TLF 1200.1", "56 TLF 1200.2"].includes(registro.name) &&
            registro.name !== "320 DEBLOCKING 1"
        );
        surtido = surtido.concat(registrosSurtido);
        produccion = produccion.concat(registrosProduccion);
        ar = ar.concat(registrosAR);
        desbloqueo = desbloqueo.concat(registrosDesbloqueo);
      } else {
        // Para otros modelos, asignamos directamente los registros formateados
        registrosPorModelo[Modelo.name] = registrosFormateados;
      }
    }
    
    // Agregar secciones especiales en caso de tener registros
    if (surtido.length > 0) {
      registrosPorModelo["surtido"] = surtido;
    }
    if (produccion.length > 0) {
      registrosPorModelo["produccion"] = produccion;
    }
    if (ar.length > 0) {
      registrosPorModelo["AR"] = ar;
    }
    if (desbloqueo.length > 0) {
      registrosPorModelo["Desbloqueo"] = desbloqueo;
    }
    res.json({ registros: registrosPorModelo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
};

export {
    obtenerRegistros,
    obtenerRegistrosTurnos,
    obtenerRegistrosTurnosRangos
}