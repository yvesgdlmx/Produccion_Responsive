import { DataTypes } from "sequelize";
import db from "../config/db.js";

const RazonesCancelados = db.define('razones_cancelados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    job_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_issue: {
        type: DataTypes.STRING,
        allowNull: true
    },
    job_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false
});

export default RazonesCancelados;