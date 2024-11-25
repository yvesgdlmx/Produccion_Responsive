import express from 'express';
import { obtenerDatosAntiguedad } from '../controllers/reporteAntiguedadController.js';

const router = express.Router();

router.get('/reportes/antiguedad', obtenerDatosAntiguedad);

export default router;