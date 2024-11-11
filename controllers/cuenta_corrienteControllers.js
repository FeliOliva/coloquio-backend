const cuenta_corrienteService = require("../services/cuenta_corrienteServices");

const getAllCuentas_Corrientes = async (req, res) => {
    try {
        const remitos = await cuenta_corrienteService.getAllCuentas_Corrientes();
        res.json(remitos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los remitos" });
    }
};

const getCuenta_CorrienteByID = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID es requerido" });
        }
        const remito = await cuenta_corrienteService.getCuenta_CorrienteByID(id);
        res.json(remito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el remito" });
    }
};
const getCuenta_CorrienteByClientID = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID es requerido" });
        }
        const cuentas_corrientes = await cuenta_corrienteService.getCuenta_CorrienteByClientID(id);
        res.json(cuentas_corrientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la cuentas_corrientes" });
    }
};


module.exports = {
    getAllCuentas_Corrientes,
    getCuenta_CorrienteByID,
    getCuenta_CorrienteByClientID
};