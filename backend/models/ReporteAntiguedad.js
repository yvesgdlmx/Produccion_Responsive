import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Antiguedad = db.define('antiguedades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    enter_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    today: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ink_queue: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    ink_ip: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hoya_queue: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    hoya_ip: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nvi_queue: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    nvi_ip: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    digital_calculator: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    }
}, {
    timestamps: false
});

export default Antiguedad;