import express from 'express'
import { obtenerRegistrosHoyYAyer, obtenerRegistrosJobCompleteSemana, obtenerRegistrosPorFecha, obtenerRegistrosPorSemana } from '../controllers/manualController.js';

const router = express.Router();

router.get('/manual/actualdia', obtenerRegistrosHoyYAyer)
router.get('/manual/surtido_detallado/:year/:month/:day', obtenerRegistrosPorFecha);
router.get('/manual/semanal/:anio/:semana', obtenerRegistrosPorSemana)
router.get('/manual/jobcomplete_semanal', obtenerRegistrosJobCompleteSemana)

export default router;