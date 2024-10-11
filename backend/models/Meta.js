import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Meta = db.define('metas_generadores', {
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

export default Meta;