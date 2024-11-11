const remitoService = require('../services/remitoServices');

const getAllRemitos = async (req, res) => {
    try {
        const detalleRemitos = await remitoService.getAllRemitos();
        res.json(detalleRemitos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los detalles de remitos' });
    }
}

const addRemito = async (req, res) => {
    try {
        const { importe, fecha, cuentaCorrienteId } = req.body;
        if (!importe || !fecha || !cuentaCorrienteId) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const result = await remitoService.addRemito({ importe, fecha, cuentaCorrienteId });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al agregar el remito' });
    }
};


const getRemitoByID = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: "ID es requerido" })
        }
        const detalleRemito = await remitoService.getRemitoByID(id);
        res.json(detalleRemito);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener el detalle de remito' });
    }
}

const dropRemito = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: "ID es requerido" })
        }
        const remito = await remitoService.getRemitoByID(id);
        if (!remito) {
            return res.status(404).json({ error: "Remito no encontrado" })
        }
        await remitoService.updateRemitoStatus(id, 0);
        res.json("Remito eliminado");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el remito' });
    }
}

const upRemito = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: "ID es requerido" })
        }
        const remito = await remitoService.getRemitoByID(id);
        if (!remito) {
            return res.status(404).json({ error: "Remito no encontrado" })
        }
        await remitoService.updateRemitoStatus(id, 1);
        res.json("Remito activado");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el remito' });
    }
}

const updateRemito = async (req, res) => {
    try {
        const { id } = req.params;
        const { importe, fecha } = req.body;
        if (!id || !importe || !fecha) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const result = await remitoService.updateRemito(id, { importe, fecha });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el remito' });
    }
};

const getRemitosByCuentaCorrienteID = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: "ID es requerido" })
        }
        const remitos = await remitoService.getRemitosByCuentaCorrienteID(id);
        res.json(remitos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los remitos' });
    }
}


module.exports = {
    getAllRemitos,
    addRemito,
    getRemitoByID,
    dropRemito,
    upRemito,
    updateRemito,
    getRemitosByCuentaCorrienteID
}