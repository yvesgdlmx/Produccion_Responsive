import express from 'express';
import { obtenerRegistrosConteoMermasHoyYAyer, obtenerRegistrosManualHoyYAyer, obtenerRegistrosRazonesMermasHoyYAyer } from '../controllers/mermasController.js';

const router = express.Router();
router.get("/conteo_de_mermas", obtenerRegistrosConteoMermasHoyYAyer);
router.get("/produccion", obtenerRegistrosManualHoyYAyer);
router.get("/razones_de_merma", obtenerRegistrosRazonesMermasHoyYAyer)
export default router;