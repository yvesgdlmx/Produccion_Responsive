import express from 'express';

import {
    obtenerWipNviPorFechaInsercion
} from '../controllers/wipOperacionResumenNviController.js';

const router = express.Router();

router.get('/wip_operacion_resumen_nvi/resumen/:anio/:mes/:dia', obtenerWipNviPorFechaInsercion);

export default router;
