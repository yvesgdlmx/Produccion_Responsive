import express from 'express'
import {nuevaMeta, obtenerMetas, editarMeta, obtenerMeta} from '../controllers/metaTerminadosController.js'

const router = express.Router();

router.post("/metas-terminados/nuevameta", nuevaMeta);
router.get("/metas-terminados", obtenerMetas);
router.get("/metas-terminados/:id", obtenerMeta);
router.put("/metas-terminados/editar/:id", editarMeta);

export default router;