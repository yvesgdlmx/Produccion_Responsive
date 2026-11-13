import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const WipProyeccionVersion = db.define('wip_proyeccion_versiones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clave: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  fechaBase: { type: DataTypes.DATEONLY, allowNull: false },
  tipo: { type: DataTypes.STRING(12), allowNull: false },
  nota: { type: DataTypes.STRING(200), allowNull: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: true },
  contenido: { type: DataTypes.JSON, allowNull: false },
}, { tableName: 'wip_proyeccion_versiones', timestamps: true, updatedAt: false, indexes: [{ fields: ['fechaBase'] }] });

export default WipProyeccionVersion;
