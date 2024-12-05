import TrabajosNuevos from '../models/TrabajosNuevos.js';

const obtenerDatosTrabajosNuevos = async (req, res) => {
    try {
        // Encuentra la fecha más reciente en la base de datos
        const fechaMasReciente = await TrabajosNuevos.max('fecha');
        console.log("Fecha más reciente encontrada:", fechaMasReciente);

        if (!fechaMasReciente) {
            return res.status(404).json({
                msg: "No se encontraron registros de trabajos nuevos",
                debug: {
                    totalRegistros: await TrabajosNuevos.count()
                }
            });
        }

        // Convertir la fecha a un formato adecuado para la comparación
        const fechaFormateada = new Date(fechaMasReciente).toISOString().split('T')[0];
        console.log("Fecha formateada para la consulta:", fechaFormateada);

        // Obtén todos los registros con la fecha más reciente
        const registros = await TrabajosNuevos.findAll({
            where: {
                fecha: fechaFormateada
            },
            order: [['hora', 'ASC']], // Ordena por hora de manera ascendente
            raw: true
        });

        res.json({
            total: registros.length,
            registros: registros
        });
    } catch (error) {
        console.error("Error al obtener datos de trabajos nuevos:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de trabajos nuevos",
            error: error.message
        });
    }
};

export {
    obtenerDatosTrabajosNuevos
};