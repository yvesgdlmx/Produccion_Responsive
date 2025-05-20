import express from 'express';
import { obtenerRegistrosNvi, obtenerRegistrosHoya, obtenerRegistrosInk } from '../controllers/facturacionController.js';

const router = express.Router();
// Por ejemplo, para obtener registros filtrando por año y semana:
router.get("/facturacion-nvi/:anio/:semana", obtenerRegistrosNvi);
router.get("/facturacion-hoya/:anio/:semana", obtenerRegistrosHoya);
router.get("/facturacion-ink/:anio/:semana", obtenerRegistrosInk);
export default router;