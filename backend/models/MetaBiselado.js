import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MetaBiselado = db.define('metas_biselados', {
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

export default MetaBiselado;