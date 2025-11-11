import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ResumenArTrabajos = db.define('resumen_ar_nvis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    en_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    antes_de_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    sin_surtir: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    recalculando: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    breakage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    despues_de_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fecha_insercion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    hora_insercion: {
        type: DataTypes.TIME,
        allowNull: true
    }
}, {
    timestamps: false
});

export default ResumenArTrabajos;