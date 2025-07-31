import express from 'express';
import { getNotasTurnos, createNotaTurno, updateNotaTurno } from '../controllers/notasTurnosController.js';
const router = express.Router();
router.get('/notas_turnos', getNotasTurnos);
router.post('/notas_turnos', createNotaTurno);
router.put('/notas_turnos', updateNotaTurno);
export default router;