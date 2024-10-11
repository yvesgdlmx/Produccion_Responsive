import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    timestamps: false, // Esto asegura que createdAt y updatedAt sean incluidos
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
});

// Métodos Personalizados
Usuario.prototype.verificarPassword = function(password){
    return password === this.password;
}

export default Usuario;