import Media from '../models/Media.js';
// Obtener todas las medias (imágenes y videos)
export const obtenerMedias = async (req, res) => {
  try {
    const medias = await Media.findAll();
    res.json(medias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
};
// Obtener un archivo por ID
export const obtenerMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
};
// Crear un archivo (imagen o video)
// Se espera recibir el archivo en el campo "media" y una descripción en el body.
export const crearMedia = async (req, res) => {
  const { descripcion } = req.body;
  const archivo = req.file;
  
  if (!archivo) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }
  try {
    // Crear registro en la base de datos
    const nuevaMedia = await Media.create({
      nombre: archivo.filename,
      descripcion,
      estado: true,
      ruta: `/uploads/${archivo.filename}` // Guardamos la ruta relativa
    });
    res.status(201).json({
      ...nuevaMedia.toJSON(),
      url: `${process.env.BACKEND_URL}/uploads/${archivo.filename}` // Devolvemos la URL completa
    });
  } catch (error) {
    console.error('Error al crear el archivo:', error);
    res.status(400).json({ error: 'Error al crear el archivo' });
  }
};
// Editar o actualizar un archivo (imagen o video)
export const editarMedia = async (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;
  const archivo = req.file; // Opcional: actualizar también el archivo en sí
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    if (archivo) {
      media.nombre = archivo.filename;
    }
    if (descripcion !== undefined) {
      media.descripcion = descripcion;
    }
    if (estado !== undefined) {
      media.estado = estado;
    }
    await media.save();
    res.json(media);
  } catch (error) {
    console.error('Error al actualizar el archivo:', error);
    res.status(400).json({ error: 'Error al actualizar el archivo' });
  }
};
// Función exclusiva para cambiar el estado del archivo (imagen o video)
export const cambiarEstadoMedia = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    media.estado = estado;
    await media.save();
    res.json(media);
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};
// Eliminar un archivo (imagen o video)
export const eliminarMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    await media.destroy();
    res.json({ mensaje: 'Archivo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
};