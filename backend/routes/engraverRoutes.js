import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/engraverController.js';

const router = express.Router();

router.get('/engraver/actualdia', obtenerRegistrosHoyYAyer)

export default router;