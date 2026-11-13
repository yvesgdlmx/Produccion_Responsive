import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const WipPlanDia = db.define('wip_plan_dias', {
  fecha: { type: DataTypes.DATEONLY, primaryKey: true },
  llegada: { type: DataTypes.INTEGER, allowNull: false },
  metaSfAr: { type: DataTypes.INTEGER, allowNull: false },
  metaSf: { type: DataTypes.INTEGER, allowNull: false },
  metaF: { type: DataTypes.INTEGER, allowNull: false },
  pctSfAr: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  pctSf: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  pctF: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'wip_plan_dias', timestamps: true });

export default WipPlanDia;
