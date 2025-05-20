import { DataTypes } from "sequelize";
import db from "../config/db.js";
const FacturacionInk = db.define('facturacion_inks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Patient: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    LensStyle: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    LensMaterial: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    LensColor: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    LensOrdered: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    LensSupplied: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    LensPrice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    ARCoating: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Mirror: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    CoatingsPrice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    Tint: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    TintOrdered: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    TintPrice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    JobType: {
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    ShipDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    TAT: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Redo: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Poder: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    semana: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
});
export default FacturacionInk;