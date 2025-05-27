import express from 'express';
import {
  obtenerRegistrosNvi,
  obtenerRegistrosHoya,
  obtenerRegistrosInk,
  obtenerRegistrosNviPorRangoFechas,
  obtenerRegistrosHoyaPorRangoFechas,
  obtenerRegistrosInkPorRangoFechas
} from '../controllers/facturacionController.js';
const router = express.Router();
// Rutas para obtener registros filtrados por año y semana:
router.get("/facturacion-nvi/:anio/:semana", obtenerRegistrosNvi);
router.get("/facturacion-hoya/:anio/:semana", obtenerRegistrosHoya);
router.get("/facturacion-ink/:anio/:semana", obtenerRegistrosInk);
// Ruta para obtener registros de Nvi filtrados por un rango de fechas:
router.get("/facturacion-nvi/rango/:fechaDeInicio/:fechaFin", obtenerRegistrosNviPorRangoFechas);
router.get("/facturacion-hoya/rango/:fechaDeInicio/:fechaFin", obtenerRegistrosHoyaPorRangoFechas);
router.get("/facturacion-ink/rango/:fechaDeInicio/:fechaFin", obtenerRegistrosInkPorRangoFechas);
export default router;