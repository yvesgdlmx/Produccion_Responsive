import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  obtenerMedias,
  obtenerMedia,
  crearMedia,
  editarMedia,
  eliminarMedia,
  cambiarEstadoMedia,
} from '../controllers/mediaController.js';
// Configuración de almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
// File filter que acepta imágenes y videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen o video'), false);
  }
};
const upload = multer({ storage, fileFilter });
const router = express.Router();
// Obtener todos los archivos (imágenes y videos)
router.get('/', obtenerMedias);
// Obtener un archivo por ID
router.get('/:id', obtenerMedia);
// Crear un archivo (imagen o video)
// Se espera recibir el archivo en el campo "media"
router.post('/crear', upload.single('media'), crearMedia);
// Editar/actualizar un archivo (otros campos, archivo opcional)
router.put('/editar/:id', upload.single('media'), editarMedia);
// Actualizar únicamente el estado del archivo
router.patch('/:id/estado', cambiarEstadoMedia);
// Eliminar un archivo
router.delete('/eliminar/:id', eliminarMedia);
export default router;