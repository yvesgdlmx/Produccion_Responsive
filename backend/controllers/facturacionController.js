import { Op, fn, col, where } from "sequelize";
import FacturacionNvi from "../models/FacturacionNvi.js";
import FacturacionHoya from "../models/FacturacionHoya.js";
import FacturacionInk from "../models/FacturacionInk.js";
// Asegúrate de importar tu instancia de Sequelize si es necesario, por ejemplo:
// import sequelize from "../config/db.js";
const obtenerRegistrosNvi = async (req, res) => {
  const { anio, semana } = req.params;
  try {
    const registros = await FacturacionNvi.findAll({
      where: {
        [Op.and]: [
          where(fn('YEAR', col('fecha')), Number(anio)),
          { semana: Number(semana) }
        ]
      }
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de FacturacionNvi:", error);
    res.status(500).json({ error: "Error al obtener los registros de facturacion_nvi" });
  }
};

const obtenerRegistrosHoya= async (req, res) => {
  const { anio, semana } = req.params;
  try {
    const registros = await FacturacionHoya.findAll({
      where: {
        [Op.and]: [
          where(fn('YEAR', col('fecha')), Number(anio)),
          { semana: Number(semana) }
        ]
      }
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de NuevoModelo:", error);
    res.status(500).json({ error: "Error al obtener los registros de NuevoModelo" });
  }
};

const obtenerRegistrosInk = async (req, res) => {
  const { anio, semana } = req.params;
  try {
    const registros = await FacturacionInk.findAll({
      where: {
        [Op.and]: [
          where(fn('YEAR', col('ShipDate')), Number(anio)),
          { semana: Number(semana) }
        ]
      }
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de NuevoModelo:", error);
    res.status(500).json({ error: "Error al obtener los registros de NuevoModelo" });
  }
};

export {
  obtenerRegistrosNvi,
  obtenerRegistrosHoya,
  obtenerRegistrosInk
}