import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ReportesResumenComp = db.define('resumen_nvis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    nvi_en_proceso: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_fs: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_total_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_total_ster: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    // Nuevas columnas añadidas aquí
    no_surtido_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    no_surtido_ster: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    surtido_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    surtido_ster: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_con_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_ar_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_ar_semi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_sin_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_sin_ar_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    nvi_sin_ar_semi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fecha_insercion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    hora_insercion: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default ReportesResumenComp;