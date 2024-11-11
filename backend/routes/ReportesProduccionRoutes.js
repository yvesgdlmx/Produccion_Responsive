import express from 'express'
import { obtenerReportesProduccion } from '../controllers/ReportesController.js';

const router = express.Router();

router.get('/reportes/produccion', obtenerReportesProduccion)

export default router;