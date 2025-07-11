import { DataTypes } from 'sequelize';
import db from '../config/db.js';
const Media = db.define('medias', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ruta: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
export default Media;