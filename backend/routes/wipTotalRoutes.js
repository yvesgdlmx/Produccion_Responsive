import express from 'express';
import { obtenerWipTotal, obtenerRazones } from '../controllers/wipTotalController.js';
const router = express.Router();

// Ruta para obtener registros por fecha usando parámetros en la URL
router.get('/reportes/wiptotal/:anio/:mes/:dia', obtenerWipTotal);
router.get('/reportes/razones/:anio/:mes/:dia', obtenerRazones)

export default router;