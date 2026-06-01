import express from 'express'
import { crearConfiguracion, obtenerConfiguraciones, obtenerConfiguracion, editarConfiguracion, obtenerConfiguracionPorNombre, bulkUpdateConfiguraciones } from '../../controllers/fracttal/defconController.js';

const router = express.Router();

router.post("/configuracion-defcon/nueva", crearConfiguracion);
router.get("/configuracion-defcon", obtenerConfiguraciones);
router.get("/configuracion-defcon/:id", obtenerConfiguracion);
router.put("/configuracion-defcon/editar/:id", editarConfiguracion);
router.get("/configuracion-defcon/nombre/:nombre", obtenerConfiguracionPorNombre);
router.put('/configuracion-defcon/bulk-update', bulkUpdateConfiguraciones);

export default router;