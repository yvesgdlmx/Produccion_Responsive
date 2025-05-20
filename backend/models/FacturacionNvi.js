import { DataTypes } from "sequelize";
import db from "../config/db.js";

const FacturacionNvi = db.define('facturacion_nvis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    semana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cot_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cot_coat: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    surf_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    surf_cost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ar_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ar: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    p_frm_s_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    p_frm_s: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    p_frm_f_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    p_frm_f: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    m_frm_s_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    m_frm_s: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    m_frm_f_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    m_frm_f: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    grad_s_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    grad_s: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    grad_f_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    grad_f: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    sol_s_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sol_s: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    sol_f_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sol_f: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    uv_s_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    uv_s: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    uv_f_lenses: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    uv_f: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    total_real: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: false
});
export default FacturacionNvi;