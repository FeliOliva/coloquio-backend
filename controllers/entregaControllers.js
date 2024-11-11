const entregaService = require("../services/entregaServices");

const getAllEntregas = async (req, res) => {
  try {
    const entregas = await entregaService.getAllEntregas();
    res.json(entregas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEntregaByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID es requerido" });
    }
    const entrega = await entregaService.getEntregaByID(id);
    if (!entrega) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    res.json(entrega);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addEntrega = async (req, res) => {
  try {
    const { total, cuentaCorrienteId } = req.body;
    if (!total || !cuentaCorrienteId) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const entrega = await entregaService.addEntrega({
      total,
      cuentaCorrienteId,
    });
    res.json(entrega);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEntrega = async (req, res) => {
  try {
    const { id } = req.params;
    const { total, cuentaCorrienteId } = req.body;
    if (!id || !total || !cuentaCorrienteId) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const entrega = await entregaService.updateEntrega(id, {
      total,
      cuentaCorrienteId,
    });
    res.json(entrega);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEntregaByCuentaCorrienteId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: "ID de cuenta corriente es requerido" });
    }
    const entrega = await entregaService.getEntregaByCuentaCorrienteId(id);
    if (!entrega) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    res.json(entrega);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getAllEntregas,
  getEntregaByID,
  addEntrega,
  updateEntrega,
  getEntregaByCuentaCorrienteId,
};
