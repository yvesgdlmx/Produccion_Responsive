import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ReportesProduccion = db.define('conteo_estaciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    enter_date: {
        type: DataTypes.DATE
    },
    tray_number: {
        type: DataTypes.STRING(50)
    },
    estacion: {
        type: DataTypes.STRING
    },
    current_station_date: {
        type: DataTypes.DATE
    },
    total: {
        type: DataTypes.INTEGER
    },
    fecha_insercion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    hora_insercion: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW
    },
    sf: {
        type: DataTypes.STRING
    },
    NVI: {
        type: DataTypes.INTEGER
    },
    HOYA: {
        type: DataTypes.INTEGER
    },
    INK: {
        type: DataTypes.INTEGER
    },
    f_count: {
        type: DataTypes.INTEGER
    },
    s_count: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});

export default ReportesProduccion;