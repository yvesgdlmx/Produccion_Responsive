import express from 'express'
import {nuevaMeta, obtenerMetas, editarMeta, obtenerMeta} from '../controllers/metaGeneradoresController.js'

const router = express.Router();

router.post("/metas-generadores/nuevameta", nuevaMeta);
router.get("/metas-generadores", obtenerMetas);
router.get("/metas-generadores/:id", obtenerMeta);
router.put("/metas-generadores/editar/:id", editarMeta);

export default router;