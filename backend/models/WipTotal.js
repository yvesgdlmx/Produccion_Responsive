import { DataTypes } from "sequelize";
import db from "../config/db.js";

const WipTotal = db.define('wip_totals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_nvi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_ink: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_hoya: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accion: {
        type: DataTypes.STRING(50), // Puedes ajustar el tamaño según sea necesario
        allowNull: false
    },
    semifinish_nvi: {
        type: DataTypes.INTEGER
    },
    finished_nvi: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false // Desactiva los campos createdAt y updatedAt
});

export default WipTotal;