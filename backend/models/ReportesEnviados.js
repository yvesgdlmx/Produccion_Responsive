import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ReportesEnviados = db.define('trabajos_enviados', {
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
    cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipped_jobs: {
        type: DataTypes.DATE,
        allowNull: false
    }, 
    shipped_sales: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    average_sales: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    finished_jobs: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    semi_finished_jobs: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default ReportesEnviados;