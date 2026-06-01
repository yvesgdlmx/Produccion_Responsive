import express from 'express';

import {
  obtenerWipPorFechaInsercion
} from '../controllers/wipOperacionResumenController.js';

const router = express.Router();

router.get('/wip_operacion_resumen/resumen/:anio/:mes/:dia', obtenerWipPorFechaInsercion);

export default router;
