import express from 'express';
import { obtenerDatosTrabajosNuevos } from '../controllers/reporteTrabajosNuevos.js';
const router = express.Router();
router.get('/reportes/nuevos', obtenerDatosTrabajosNuevos);

export default router;