import express from 'express'
import { obtenerDatosNvi } from '../controllers/resumenTrabajosController.js';

const router = express.Router();

router.get('/reportes/resumen/:anio/:mes/:dia', obtenerDatosNvi)

export default router;