import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/pulidoController.js';

const router = express.Router();

router.get('/pulido/actualdia', obtenerRegistrosHoyYAyer)

export default router;