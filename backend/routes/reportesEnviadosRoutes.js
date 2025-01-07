import express from 'express'
import { obtenerDatosReportesEnviados } from '../controllers/reportesEnviadosController.js';

const router = express.Router();

router.get('/reportes/enviados', obtenerDatosReportesEnviados)

export default router;