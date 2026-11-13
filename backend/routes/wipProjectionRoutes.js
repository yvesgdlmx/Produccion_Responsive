import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import checkWipAccess from '../middleware/checkWipAccess.js';
import { getPlanning, savePlanning, previewPlanning, getCurrent, getMonth, saveCurrent, getHistory, getVersion } from '../controllers/wipProjectionController.js';

const router = express.Router();
router.use(checkAuth, checkWipAccess);
router.get('/planeacion/:year', getPlanning);
router.post('/planeacion/:year/vista-previa', previewPlanning);
router.put('/planeacion/:year', savePlanning);
router.get('/actual', getCurrent);
router.get('/mes', getMonth);
router.post('/versiones', saveCurrent);
router.get('/versiones', getHistory);
router.get('/versiones/:id', getVersion);
export default router;
