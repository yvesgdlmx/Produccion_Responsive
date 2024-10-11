import express from 'express'
import { nuevaMeta, obtenerMetas, obtenerMeta, editarMeta } from '../controllers/metaPulidosController.js';

const router = express.Router();

router.post("/metas-pulidos/nuevameta", nuevaMeta);
router.get("/metas-pulidos", obtenerMetas);
router.get("/metas-pulidos/:id", obtenerMeta);
router.put("/metas-pulidos/editar/:id", editarMeta);

export default router;