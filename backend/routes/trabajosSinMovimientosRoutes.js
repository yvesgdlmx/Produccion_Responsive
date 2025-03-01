import express from 'express';
import { obtenerTodosTrabajosSinMovimientos } from '../controllers/trabajosSinMovimientosController.js';
const router = express.Router();
router.get('/reportes/movimientos', obtenerTodosTrabajosSinMovimientos);

export default router;