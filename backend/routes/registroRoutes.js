import express from 'express'
import { obtenerRegistrosHoyYAyer } from '../controllers/registroController.js';

const router = express.Router();

router.get('/generadores/actualdia', obtenerRegistrosHoyYAyer)

export default router;