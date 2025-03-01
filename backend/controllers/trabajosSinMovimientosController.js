import TrabajosSinMovimientos from '../models/TrabajosSinMovimientos.js';

const obtenerTodosTrabajosSinMovimientos = async (req, res) => {
    try {
        const registros = await TrabajosSinMovimientos.findAll({
            order: [['id', 'ASC']], // Puedes ordenar por el campo que prefieras
            raw: true
        });
        res.json({
            total: registros.length,
            registros: registros
        });
    } catch (error) {
        console.error("Error al obtener datos de trabajos sin movimientos:", error);
        res.status(500).json({
            msg: "Error al obtener los datos de trabajos sin movimientos",
            error: error.message
        });
    }
};
export {
    obtenerTodosTrabajosSinMovimientos
};