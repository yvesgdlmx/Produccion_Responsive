import NotasTurnos from "../models/NotasTurno.js";

const getNotasTurnos = async (req, res) => {
  try {
    const { seccion, fecha, turno } = req.query;
    const condiciones = {};
    if (seccion) {
      condiciones.seccion = seccion;
    }
    if (fecha) {
      condiciones.fecha = fecha;
    }
    if (turno) {
      condiciones.turno = turno;
    }
    const notas = await NotasTurnos.findAll({
      where: condiciones,
      order: [["fecha", "DESC"], ["turno", "ASC"]],
    });
    res.json(notas);
  } catch (error) {
    console.error("Error al obtener notas de turno:", error);
    res.status(500).json({ message: "Error al obtener las notas de turno" });
  }
};
// Controlador para crear una nota de turno
const createNotaTurno = async (req, res) => {
  try {
    const { fecha, turno, seccion, comentario } = req.body;
    // Validamos que se proporcionen los campos obligatorios.
    if (!fecha || !turno || !seccion) {
      return res.status(400).json({
        message: "Los campos 'fecha', 'turno' y 'seccion' son obligatorios",
      });
    }
    const nuevaNota = await NotasTurnos.create({
      fecha,
      turno,
      seccion,
      comentario: comentario || null,
    });
    res.status(201).json(nuevaNota);
  } catch (error) {
    console.error("Error al crear la nota de turno:", error);
    res.status(500).json({ message: "Error al crear la nota de turno" });
  }
};
// Controlador para actualizar (editar) una nota de turno existente
const updateNotaTurno = async (req, res) => {
  try {
    const { id, comentario } = req.body;
    // Verificar que se haya pasado el id
    if (!id) {
      return res.status(400).json({
        message: "El campo 'id' es obligatorio para actualizar la nota",
      });
    }
    // Buscar la nota por su ID
    const notaExistente = await NotasTurnos.findByPk(id);
    if (!notaExistente) {
      return res.status(404).json({ message: "Nota de turno no encontrada" });
    }
    // Actualizar el contenido de la nota
    notaExistente.comentario = comentario;
    await notaExistente.save();
    res.json(notaExistente);
  } catch (error) {
    console.error("Error al actualizar la nota de turno:", error);
    res.status(500).json({ message: "Error al actualizar la nota de turno" });
  }
};
export { getNotasTurnos, createNotaTurno, updateNotaTurno };