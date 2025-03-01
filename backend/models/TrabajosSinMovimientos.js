import { DataTypes } from "sequelize";
import db from "../config/db.js";
const TrabajosSinMovimientos = db.define('trabajos_sin_movimientos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    enter_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    acct: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tray_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    ink_tray: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    current_station: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    current_stn_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    division: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    days_in_process: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    current_stn_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    coat: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    f_s: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    dia_actual: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_actual: {
        type: DataTypes.TIME,
        allowNull: false
    },
    transcurrido: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    timestamps: false
});
export default TrabajosSinMovimientos;