import express from 'express'
import { autenticar, perfil } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post("/login", autenticar);
router.get("/perfil", checkAuth, perfil);

export default router;

