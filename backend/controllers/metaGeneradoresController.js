import Meta from '../models/Meta.js'

const nuevaMeta = async (req, res) => {
    const meta = new Meta(req.body);
    
    try {
        const metaAlmacenada = await meta.save();
        res.json(metaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

const obtenerMetas = async (req, res) => {
    const registros = await Meta.findAll();
    res.json({ registros });
}

const obtenerMeta = async (req, res) => {
    const { id } = req.params

    const meta = await Meta.findByPk(id);

    res.json(meta);
}

const editarMeta = async (req, res) => {
    const { id } = req.params;
    const meta = await Meta.findByPk(id);

    if(!meta) {
        const error = new Error('No existe la meta');
        res.status(404).json({ msg: error.message });
    }

    meta.meta = req.body.meta || meta.meta;
    meta.name = req.body.name || meta.name;

    try {
        const metaAlmacenada = await meta.save();
        res.json(metaAlmacenada);
    } catch (error) {
        console.log(error);
    }
}


const eliminarMeta = async (req, res) => {
    
}

export {
    nuevaMeta,
    obtenerMetas,
    obtenerMeta,
    editarMeta,
    eliminarMeta
}