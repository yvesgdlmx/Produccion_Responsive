import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import checkWipAccess from '../middleware/checkWipAccess.js';
import { getPlanning, savePlanning, previewPlanning, getCurrent, getMonth, saveCurrent, getHistory, getVersion } from '../controllers/wipProjectionController.js';

const router = express.Router();
router.get('/planeacion/:year', getPlanning);
router.post('/planeacion/:year/vista-previa', checkAuth, checkWipAccess, previewPlanning);
router.put('/planeacion/:year', checkAuth, checkWipAccess, savePlanning);
router.get('/actual', getCurrent);
router.get('/mes', getMonth);
router.post('/versiones', checkAuth, checkWipAccess, saveCurrent);
router.get('/versiones', checkAuth, checkWipAccess, getHistory);
router.get('/versiones/:id', checkAuth, checkWipAccess, getVersion);
export default router;
