import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const CLIENTES = ['nvi', 'ink'];

const PROCESOS = [
    'pulido',
    'hc',
    'campana',
    'bloqueo_tallado',
    'biselado_automatico',
    'generado',
    'biselado_manual',
    'inspeccion',
    'tinte',
    'auditoria_tallado',
    'auditoria_terminado',
    'salida_hc',
    'salida_ar',
    'engraver',
    'sin_surtir',
    'surtido',
    'rxvalidar',
    'ar_entrada',
    'desblocking',
    'bkg_wh_in',
    'breakage',
    'digital_calc',
    'detallado'
];

const COATINGS = ['clr', 'cot', 'par', 'other'];
const LENSPICKS = ['f', 's'];

const detalleColumns = {};

CLIENTES.forEach(cliente => {
    PROCESOS.forEach(proceso => {
        COATINGS.forEach(coating => {
            LENSPICKS.forEach(lenspick => {
                detalleColumns[`${cliente}_detalle_${proceso}_${coating}_${lenspick}`] = {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                };
            });
        });
    });
});

const WipOperacionResumen = db.define('wip_operacion_resumen', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_insercion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_insercion: {
        type: DataTypes.TIME,
        allowNull: false
    },
    total_en_ar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_tallado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_sin_surtir: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_recalculando: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_merma: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_detallado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_surtido: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_terminado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },

    ...detalleColumns
}, {
    timestamps: false,
    tableName: 'wip_operacion_resumen'
});

export default WipOperacionResumen;
