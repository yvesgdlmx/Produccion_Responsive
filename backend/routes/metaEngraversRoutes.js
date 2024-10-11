import express from 'express'
import { nuevaMeta, obtenerMetas, obtenerMeta, editarMeta } from '../controllers/metaEngraversController.js';

const router = express.Router();

router.post("/metas-engravers/nuevameta", nuevaMeta);
router.get("/metas-engravers", obtenerMetas);
router.get("/metas-engravers/:id", obtenerMeta);
router.put("/metas-engravers/editar/:id", editarMeta);

export default router;