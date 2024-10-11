import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/biseladoController.js';

const router = express.Router();

router.get('/biselado/actualdia', obtenerRegistrosHoyYAyer)

export default router;