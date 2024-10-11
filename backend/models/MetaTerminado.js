import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaTerminado = db.define('metas_terminados', {
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

export default MetaTerminado;