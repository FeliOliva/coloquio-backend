const clientService = require("../services/clientServices");


const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addClient = async (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Nombre es requerido' });
        }
        const client = await clientService.addClient(nombre, apellido);
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const getClientByID = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
        }
        const client = await clientService.getClientByID(id);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const dropClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientByID(id);
        if (!client) return res.status(404).json({ error: "Cliente no encontrado" });

        await clientService.updateClientStatus(id, 0);
        res.status(200).json({ message: "Cliente eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el cliente" });
    }
};

const upClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientByID(id);
        if (!client) return res.status(404).json({ error: "Cliente no encontrado" });

        await clientService.updateClientStatus(id, 1);
        res.status(200).json({ message: "Cliente activado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al activar el cliente" });
    }
};

const updateClients = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido } = req.body;
        if (!id) return res.status(400).json({ error: "ID es requerido" });
        const client = await clientService.getClientByID(id);
        if (!client) return res.status(404).json({ error: "Cliente no encontrado" });

        await clientService.updateClient(id, { nombre, apellido });
        res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el cliente" });
    }
};

const searchClients = async (req, res) => {
    try {
        const { nombre, apellido } = req.query;
        console.log(nombre, apellido);
        if (!nombre) {
            return res.status(400).json({ error: 'Nombre es requerido' });
        }

        const clients = await clientService.searchClients(nombre, apellido);
        if (clients.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(clients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllClients,
    addClient,
    getClientByID,
    dropClient,
    upClient,
    updateClients,
    searchClients
}