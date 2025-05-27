import express from 'express'
import { obtenerRegistrosHoyYAyer, obtenerRegistrosPorFecha, obtenerRegistrosPorSemana } from '../controllers/manualController.js';

const router = express.Router();

router.get('/manual/actualdia', obtenerRegistrosHoyYAyer)
router.get('/manual/surtido_detallado/:year/:month/:day', obtenerRegistrosPorFecha);
router.get('/manual/semanal/:anio/:semana', obtenerRegistrosPorSemana)

export default router;