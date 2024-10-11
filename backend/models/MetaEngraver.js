import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaEngraver = db.define('metas_engravers', {
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

export default MetaEngraver;