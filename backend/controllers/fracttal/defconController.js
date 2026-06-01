import ConfiguracionDefcon from "../../models/fracttal/ConfiguracionDefcon.js";

const crearConfiguracion = async (req, res) => {
    try {
        const { codigo, nombre, prodHora, horasDisponibles, objetivo } = req.body;

        const nuevaConfig = await ConfiguracionDefcon.create({
            codigo,
            nombre,
            prodHora,
            horasDisponibles,
            objetivo
        });

        res.status(201).json({
            msg: "Configuración DEFCON creada exitosamente",
            data: nuevaConfig
        });
    } catch (error) {
        console.error("Error al crear configuración:", error);
        res.status(500).json({
            msg: "Error al crear la configuración",
            error: error.message
        });
    }
};

const obtenerConfiguraciones = async (req, res) => {
    try {
        const configuraciones = await ConfiguracionDefcon.findAll();

        res.json({
            total: configuraciones.length,
            data: configuraciones
        });
    } catch (error) {
        console.error("Error al obtener configuraciones:", error);
        res.status(500).json({
            msg: "Error al obtener las configuraciones",
            error: error.message
        });
    }
};

const obtenerConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;

        const configuracion = await ConfiguracionDefcon.findByPk(id);

        if (!configuracion) {
            return res.status(404).json({
                msg: "Configuración no encontrada"
            });
        }

        res.json(configuracion);
    } catch (error) {
        console.error("Error al obtener configuración:", error);
        res.status(500).json({
            msg: "Error al obtener la configuración",
            error: error.message
        });
    }
};

const editarConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, nombre, prodHora, horasDisponibles, objetivo } = req.body;

        const configuracion = await ConfiguracionDefcon.findByPk(id);

        if (!configuracion) {
            return res.status(404).json({
                msg: "Configuración no encontrada"
            });
        }

        await configuracion.update({
            codigo,
            nombre,
            prodHora,
            horasDisponibles,
            objetivo
        });

        res.json({
            msg: "Configuración actualizada exitosamente",
            data: configuracion
        });
    } catch (error) {
        console.error("Error al editar configuración:", error);
        res.status(500).json({
            msg: "Error al editar la configuración",
            error: error.message
        });
    }
};

const obtenerConfiguracionPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        const configuracion = await ConfiguracionDefcon.findOne({
            where: { nombre }
        });

        if (!configuracion) {
            return res.status(404).json({
                msg: "Configuración no encontrada"
            });
        }

        res.json(configuracion);
    } catch (error) {
        console.error("Error al obtener configuración:", error);
        res.status(500).json({
            msg: "Error al obtener la configuración",
            error: error.message
        });
    }
};

const bulkUpdateConfiguraciones = async (req, res) => {
  try {
    const { configuraciones } = req.body;
    for (const config of configuraciones) {
      // Busca por código y nombre, actualiza o crea si no existe
      let registro = await ConfiguracionDefcon.findOne({
        where: { codigo: config.codigo, nombre: config.nombre }
      });
      if (registro) {
        await registro.update({
          prodHora: config.prodHora,
          horasDisponibles: config.horasDisponibles,
          objetivo: config.objetivo
        });
      } else {
        await ConfiguracionDefcon.create(config);
      }
    }
    res.json({ msg: "Configuraciones actualizadas correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en bulk update", error: error.message });
  }
};

export {
    crearConfiguracion,
    obtenerConfiguraciones,
    obtenerConfiguracion,
    editarConfiguracion,
    obtenerConfiguracionPorNombre,
    bulkUpdateConfiguraciones
};