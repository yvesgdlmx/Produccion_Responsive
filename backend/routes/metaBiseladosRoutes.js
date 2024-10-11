import express from 'express'
import {nuevaMeta, obtenerMetas, editarMeta, obtenerMeta} from '../controllers/metaBiseladosController.js'

const router = express.Router();

router.post("/metas-biselados/nuevameta", nuevaMeta);
router.get("/metas-biselados", obtenerMetas);
router.get("/metas-biselados/:id", obtenerMeta);
router.put("/metas-biselados/editar/:id", editarMeta);

export default router;