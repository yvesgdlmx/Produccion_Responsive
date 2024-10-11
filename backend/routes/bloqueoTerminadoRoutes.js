import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/bloqueoTerminadoController.js';

const router = express.Router();

router.get('/terminado/actualdia', obtenerRegistrosHoyYAyer)

export default router;