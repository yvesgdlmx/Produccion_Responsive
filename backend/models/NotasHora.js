import { DataTypes } from "sequelize";
import db from "../config/db.js";
const NotasHora = db.define('notas_horas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  seccion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  nota: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: false
});
export default NotasHora;