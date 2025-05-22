import { DataTypes } from "sequelize";
import db from "../../config/db.js";
const RazonesDeMerma = db.define('conteo_razones_mermas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hora: {
    type: DataTypes.TIME(10),
    allowNull: true
  },
  razon: {
    type: DataTypes.STRING(100),
    allowNull: true
  }, 
  total: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  traynumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  part: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  timestamps: false
});
export default RazonesDeMerma;