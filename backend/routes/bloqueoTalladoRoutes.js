import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/bloqueoTalladoController.js';

const router = express.Router();

router.get('/tallado/actualdia', obtenerRegistrosHoyYAyer)

export default router;