import { DataTypes } from "sequelize";
import db from "../config/db.js";
const FacturacionHoya = db.define('facturacion_hoyas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    trabajos_tallados: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    precio_tallado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    trabajos_hc: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    precio_hc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    trabajos_ar_standard: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    precio_ar_standard: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    trabajos_ar_premium: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    precio_ar_premium: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    semana: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    timestamps: false
});
export default FacturacionHoya;