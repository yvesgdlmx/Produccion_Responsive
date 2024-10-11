import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar su password
    if (usuario.verificarPassword(password)) {
        const token = generarJWT(usuario.id);

        // Guardar el token en la base de datos
        usuario.token = token;
        await usuario.save();

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: token,
        });
    } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};

const perfil = async (req, res) => {
    const { usuario } = req;
  
    res.json(usuario);
};
  

export {
    autenticar,
    perfil
};