import express from 'express'
import { obtenerRegistrosHoyYAyer, obtenerRegistrosPorFecha } from '../controllers/manualController.js';

const router = express.Router();

router.get('/manual/actualdia', obtenerRegistrosHoyYAyer)
router.get('/manual/surtido_detallado/:year/:month/:day', obtenerRegistrosPorFecha);

export default router;