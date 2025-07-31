import { DataTypes } from "sequelize";
import db from "../config/db.js";
const NotasTurnos = db.define('notas_turnos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  turno: {
    type: DataTypes.ENUM('nocturno', 'matutino', 'vespertino'),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  seccion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});
export default NotasTurnos;