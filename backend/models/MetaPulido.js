import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaPulido = db.define('metas_pulidos', {
    name: {
        type: DataTypes.STRING
    },
     meta_nocturno: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    meta_matutino: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    meta_vespertino: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        timestamps: false
    }
);

export default MetaPulido;
