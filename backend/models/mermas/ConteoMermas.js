import { DataTypes } from "sequelize";
import db from "../../config/db.js";
const ConteoMermas = db.define('conteo_mermas', {
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
    type: DataTypes.STRING(10),
    allowNull: true
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false
});
export default ConteoMermas;