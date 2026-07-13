import express from "express";
import { obtenerDatosResumenTrabajosInk } from "../controllers/resumenTrabajosInkController.js";

const router = express.Router();

router.get("/reportes_ink/resumen/:anio/:mes/:dia", obtenerDatosResumenTrabajosInk);

export default router;
