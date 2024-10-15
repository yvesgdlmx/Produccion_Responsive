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
        const registros = [];
        
        // Crear fechas de inicio y fin del rango
        const fechaInicio = moment.tz(`${anio}-${mes}-${dia} 00:00:00`, 'America/Mexico_City');
        const fechaFin = moment(fechaInicio).add(1, 'days').startOf('day');

        // Obtener registros de todos los modelos
        for (const Modelo of modelos) {
            const registrosModelo = await Modelo.findAll({
                where: {
                    fecha: {
                        [Op.gte]: fechaInicio.toDate(),
                        [Op.lt]: fechaFin.toDate()
                    }
                }
            });

            // Formatear la fecha de cada registro y extraer el nombre adecuadamente
            const registrosFormateados = registrosModelo.map((registro) => {
                const nombreParts = registro.name.split('-');
                const nombre = nombreParts.length > 1 ? nombreParts[0].trim() : registro.name;
                return {
                    ...registro.toJSON(),
                    fecha: moment(registro.fecha).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'),
                    name: nombre
                };
            });
            registros.push(...registrosFormateados);
        }
        res.json({ registros });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros' });
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
    const { anio, mes, diaInicio, diaFin } = req.params;
    try {
      const registros = [];
      // Obtener registros de todos los modelos
      for (const Modelo of modelos) {
        const registrosModelo = await Modelo.findAll({
          where: {
            [Sequelize.Op.and]: [
              {
                fecha: {
                  [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), anio),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), mes),
                    {
                      [Sequelize.Op.or]: [
                        {
                          [Sequelize.Op.and]: [
                            Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fecha')), {
                              [Sequelize.Op.gte]: diaInicio
                            }),
                            Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fecha')), {
                              [Sequelize.Op.lte]: diaFin
                            })
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        });
        // Formatear la fecha de cada registro y extraer el nombre adecuadamente
        const registrosFormateados = registrosModelo.map((registro) => {
          // Dividir el nombre por el guion y tomar la primera parte
          const nombreParts = registro.name.split('-');
          const nombre = nombreParts.length > 1 ? nombreParts[0].trim() : registro.name;
          return {
            ...registro.toJSON(),
            fecha: registro.fecha.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
            name: nombre
          };
        });
        registros.push(...registrosFormateados);
      }
      res.json({ registros });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
    }
  };

export {
    obtenerRegistros,
    obtenerRegistrosTurnos,
    obtenerRegistrosTurnosRangos
}