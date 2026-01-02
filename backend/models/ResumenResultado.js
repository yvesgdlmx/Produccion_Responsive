import { DataTypes } from 'sequelize';
import db from "../config/db.js";

const ResumenResultado = db.define('resumen_resultados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    semana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    diario: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    meta_sf: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    real_sf: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    diferencia_sf: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    acumulado_sf_mensual: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    meta_f: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    real_f: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    diferencia_f: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    acumulado_f_mensual: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    proyectado_suma: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    real_suma: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trabajos_nocturno: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trabajos_mat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trabajos_vesp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    asistencia_nocturno: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    asistencia_mat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    asistencia_vesp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    indicador_nocturno: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    indicador_mat: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    indicador_vesp: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    fact_proyect: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    facturacion_real: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    diferencia_fact: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    acumulado_mensual: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    acumulado_anual: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    }
}, {
    timestamps: false
});

export default ResumenResultado;