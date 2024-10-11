import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/manualController.js';

const router = express.Router();

router.get('/manual/actualdia', obtenerRegistrosHoyYAyer)

export default router;