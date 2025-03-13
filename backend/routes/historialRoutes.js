import express from 'express'
import { obtenerRegistros, obtenerRegistrosTurnos, obtenerRegistrosTurnosRangos } from '../controllers/historialController.js';

const router = express.Router();

router.get("/historial/:nombreModelo/:anio/:mes/:dia/:rangoHora", obtenerRegistros);
router.get("/historial-2/:anio/:mes/:dia", obtenerRegistrosTurnos);
router.get("/historial-3/:anioInicio/:mesInicio/:diaInicio/:anioFin/:mesFin/:diaFin", obtenerRegistrosTurnosRangos);

export default router;