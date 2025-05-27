import { Op, fn, col, where } from "sequelize";
import FacturacionNvi from "../models/FacturacionNvi.js";
import FacturacionHoya from "../models/FacturacionHoya.js";
import FacturacionInk from "../models/FacturacionInk.js";

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

const obtenerRegistrosNviPorRangoFechas = async (req, res) => {
  const { fechaDeInicio, fechaFin } = req.params;
  try {
    const registros = await FacturacionNvi.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaDeInicio, fechaFin]
        }
      },
      order: [['fecha', 'DESC']]
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de FacturacionNvi por rango de fechas:", error);
    res.status(500).json({ error: "Error al obtener los registros de facturacion_nvi por rango de fechas" });
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

const obtenerRegistrosHoyaPorRangoFechas = async (req, res) => {
  const { fechaDeInicio, fechaFin } = req.params;
  try {
    const registros = await FacturacionHoya.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaDeInicio, fechaFin]
        }
      },
      order: [['fecha', 'DESC']]
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de FacturacionHoya por rango de fechas:", error);
    res.status(500).json({ error: "Error al obtener los registros de FacturacionHoya por rango de fechas" });
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

const obtenerRegistrosInkPorRangoFechas = async (req, res) => {
  const { fechaDeInicio, fechaFin } = req.params;
  try {
    const registros = await FacturacionInk.findAll({
      where: {
        ShipDate: {
          [Op.between]: [fechaDeInicio, fechaFin]
        }
      },
      order: [['ShipDate', 'DESC']]
    });
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de FacturacionInk por rango de fechas:", error);
    res.status(500).json({ error: "Error al obtener los registros de FacturacionInk por rango de fechas" });
  }
};

export {
  obtenerRegistrosNvi,
  obtenerRegistrosHoya,
  obtenerRegistrosInk,
  obtenerRegistrosNviPorRangoFechas,
  obtenerRegistrosHoyaPorRangoFechas,
  obtenerRegistrosInkPorRangoFechas
}