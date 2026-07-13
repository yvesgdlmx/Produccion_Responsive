import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ResumenTrabajosInk = db.define("resumen_trabajos_ink", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sin_surtir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sin_surtir_con_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sin_surtir_sin_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sin_material: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sin_material_con_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sin_material_sin_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    surtido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    surtido_con_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    surtido_sin_ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    verde: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    azul: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    blanco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fecha_insercion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_insercion: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export default ResumenTrabajosInk;
