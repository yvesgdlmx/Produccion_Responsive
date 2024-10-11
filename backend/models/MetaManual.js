import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaManual = db.define('metas_manuales', {
    name: {
        type: DataTypes.STRING
    },
    meta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        timestamps: false
    }
);

export default MetaManual;