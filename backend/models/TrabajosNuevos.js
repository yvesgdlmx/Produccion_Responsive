import { DataTypes } from "sequelize";
import db from "../config/db.js";

const TrabajosNuevos = db.define('trabajos_nuevos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    total_new_jobs: {
        type: DataTypes.INTEGER
    },
    ink_jobs: {
        type: DataTypes.INTEGER
    },
    ink_no_ar: {
        type: DataTypes.INTEGER
    },
    ink_ar: {
        type: DataTypes.INTEGER
    },
    hoya_jobs: {
        type: DataTypes.INTEGER
    },
    hoya_no_ar: {
        type: DataTypes.INTEGER
    },
    hoya_ar: {
        type: DataTypes.INTEGER
    },
    nvi_jobs: {
        type: DataTypes.INTEGER
    },
    nvi_no_ar: {
        type: DataTypes.INTEGER
    },
    nvi_ar: {
        type: DataTypes.INTEGER
    },
    terminado: {
        type: DataTypes.INTEGER
    },
    semi_term: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});

export default TrabajosNuevos;