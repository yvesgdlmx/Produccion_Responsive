import express from 'express';
import { getNotas, createNota, updateNota } from '../controllers/notasController.js';
const router = express.Router();
router.get('/notas', getNotas);
router.post('/notas', createNota);
router.put('/notas', updateNota);
export default router;