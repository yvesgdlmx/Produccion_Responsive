import { DataTypes } from "sequelize";
import db from "../../config/db.js"

const ConfiguracionDefcon = db.define('configuraciones_defcons', {
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prodHora: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    horasDisponibles: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    objetivo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true
});

export default ConfiguracionDefcon;