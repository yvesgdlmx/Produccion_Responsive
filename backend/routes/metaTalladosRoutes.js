import express from 'express'
import {nuevaMeta, obtenerMetas, editarMeta, obtenerMeta} from '../controllers/metaTalladosController.js'

const router = express.Router();

router.post("/metas-tallados/nuevameta", nuevaMeta);
router.get("/metas-tallados", obtenerMetas);
router.get("/metas-tallados/:id", obtenerMeta);
router.put("/metas-tallados/editar/:id", editarMeta);

export default router;