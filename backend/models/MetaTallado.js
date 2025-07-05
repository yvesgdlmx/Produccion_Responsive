import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaTallado = db.define('metas_tallados', {
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

export default MetaTallado;