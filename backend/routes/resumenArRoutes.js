import express from 'express'
import { obtenerDatosResumenArTrabajos } from '../controllers/resumenArTrabajosController.js';

const router = express.Router();

router.get('/reportes_ar/resumen/:anio/:mes/:dia', obtenerDatosResumenArTrabajos)

export default router;