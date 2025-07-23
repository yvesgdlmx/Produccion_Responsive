import NotasHora from "../models/NotasHora.js";
// Controlador para obtener las notas (ya existente)
const getNotas = async (req, res) => {
  try {
    const { seccion, fecha } = req.query;
    const condiciones = {};
    if (seccion) {
      condiciones.seccion = seccion;
    }
    if (fecha) {
      condiciones.fecha = fecha;
    }
    const notas = await NotasHora.findAll({
      where: condiciones,
      order: [["fecha", "DESC"], ["hora", "ASC"]],
    });
    res.json(notas);
  } catch (error) {
    console.error("Error al obtener notas:", error);
    res.status(500).json({ message: "Error al obtener las notas" });
  }
};
// Controlador para crear una nota (ya existente)
const createNota = async (req, res) => {
  try {
    const { fecha, hora, seccion, nota } = req.body;
    // Validamos que se proporcionen los campos obligatorios.
    if (!fecha || !hora || !seccion) {
      return res.status(400).json({
        message: "Los campos 'fecha', 'hora' y 'seccion' son obligatorios",
      });
    }
    const nuevaNota = await NotasHora.create({
      fecha,
      hora,
      seccion,
      nota: nota || null,
    });
    res.status(201).json(nuevaNota);
  } catch (error) {
    console.error("Error al crear la nota:", error);
    res.status(500).json({ message: "Error al crear la nota" });
  }
};
// Controlador para actualizar (editar) una nota existente
const updateNota = async (req, res) => {
  try {
    const { id, nota } = req.body;
    // Verificar que se haya pasado el id y la nota
    if (!id) {
      return res.status(400).json({
        message: "El campo 'id' es obligatorio para actualizar la nota",
      });
    }
    // Buscar la nota por su ID
    const notaExistente = await NotasHora.findByPk(id);
    if (!notaExistente) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    // Actualizar el contenido de la nota
    notaExistente.nota = nota;
    await notaExistente.save();
    res.json(notaExistente);
  } catch (error) {
    console.error("Error al actualizar la nota:", error);
    res.status(500).json({ message: "Error al actualizar la nota" });
  }
};
export { getNotas, createNota, updateNota };