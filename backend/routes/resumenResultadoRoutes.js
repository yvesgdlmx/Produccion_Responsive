import express from 'express'
import { 
    obtenerResumenResultados,
    actualizarAsistencias,
    actualizarMetasDiarias,
    obtenerTodosLosRegistros,
    obtenerPorcentajesMensuales
} from '../controllers/resumenResultadoController.js';

const router = express.Router();

router.get('/resumen_resultados/:anio', obtenerResumenResultados);
router.get('/resumen_resultados/todos/:anio', obtenerTodosLosRegistros);
router.get('/resumen_resultados/porcentajes/:anio', obtenerPorcentajesMensuales)
router.put('/actualizar_asistencias', actualizarAsistencias);
router.put('/actualizar_metas_diarias', actualizarMetasDiarias);

export default router;