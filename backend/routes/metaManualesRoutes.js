import express from 'express'
import {nuevaMeta, obtenerMetas, editarMeta, obtenerMeta} from '../controllers/metaManualesController.js'

const router = express.Router();

router.post("/metas-manuales/nuevameta", nuevaMeta);
router.get("/metas-manuales", obtenerMetas);
router.get("/metas-manuales/:id", obtenerMeta);
router.put("/metas-manuales/editar/:id", editarMeta);

export default router;