import MetaEngraver from '../models/MetaEngraver.js'

const nuevaMeta = async (req, res) => {
    const meta = new MetaEngraver(req.body);
    
    try {
        const metaAlmacenada = await meta.save();
        res.json(metaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

const obtenerMetas = async (req, res) => {
    const registros = await MetaEngraver.findAll();
    res.json({ registros });
}

const obtenerMeta = async (req, res) => {
    const { id } = req.params

    const meta = await MetaEngraver.findByPk(id);

    res.json(meta);
}

const editarMeta = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar la meta por su id
        const meta = await MetaEngraver.findByPk(id);
        if (!meta) {
            return res.status(404).json({ msg: 'No existe la meta' });
        }
        // Extraer los nuevos valores de las metas de cada turno del cuerpo de la petición
        const { meta_nocturno, meta_matutino, meta_vespertino } = req.body;
        // Actualizar únicamente los campos de las metas utilizando el operador de coalescencia nula (??)
        // para conservar el valor actual si no se proporciona uno nuevo.
        meta.meta_nocturno = meta_nocturno ?? meta.meta_nocturno;
        meta.meta_matutino = meta_matutino ?? meta.meta_matutino;
        meta.meta_vespertino = meta_vespertino ?? meta.meta_vespertino;
        // Guardar los cambios en la base de datos
        const metaAlmacenada = await meta.save();
        res.json(metaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const eliminarMeta = async (req, res) => {
    
}

export {
    nuevaMeta,
    obtenerMetas,
    obtenerMeta,
    editarMeta,
    eliminarMeta
}