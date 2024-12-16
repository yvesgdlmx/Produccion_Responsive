import express from 'express';
import { obtenerWipTotal } from '../controllers/wipTotalController.js';
const router = express.Router();

// Ruta para obtener registros por fecha usando parámetros en la URL
router.get('/reportes/wiptotal/:anio/:mes/:dia', obtenerWipTotal);

export default router;