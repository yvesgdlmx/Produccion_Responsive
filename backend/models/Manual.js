import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Manual = db.define('manuales', {
    name: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.DATE
    },
    mean: {
        type: DataTypes.STRING
    },
    median: {
        type: DataTypes.STRING
    },
    hits: {
        type: DataTypes.INTEGER
    },
    multi: {
        type: DataTypes.DECIMAL
    }, 
    shortest: {
        type: DataTypes.STRING
    },
    longest: {
        type: DataTypes.STRING
    },
    total: {
        type: DataTypes.STRING
    },
    stddev: {
        type: DataTypes.STRING
    },
    hour: {
        type: DataTypes.STRING
    },
    num: {
        type: DataTypes.INTEGER
    }
},
    {
        timestamps: false
    }
);

export default Manual;