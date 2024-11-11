const chatService = require("../services/chatServices");
const axios = require("axios");

// Función para validar los datos necesarios para cada acción
const validateData = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Configuración de acciones y sus respectivas funciones de controlador
const actionHandlers = {
  agregar_cliente: async (data) => {
    const validationError = validateData(data, ["nombre"]);
    if (validationError) return { error: validationError };
    console.log(data);
    await axios.post("https://coloquio-backend.vercel.app/api/clients", {
      nombre: data.nombre,
      apellido: data.apellido || "",
    });
    return { message: `Cliente agregado con éxito: ${data.nombre} ${data.apellido || ""}` };
  },

  update_cliente: async (data) => {
    const validationError = validateData(data, ["nombreCliente", "newNombre", "newApellido", "apellidoCliente"]);
    console.log(validationError);
    if (validationError) return { error: validationError };

    const nombreMayus = data.nombreCliente.toUpperCase();
    const apellidoMayus = data.apellidoCliente.toUpperCase();
    console.log("nombreMayus:", nombreMayus);
    console.log("apellidoMayus:", apellidoMayus);
    console.log("nuevo nombre:", data.newNombre);
    console.log("nuevo apellido:", data.newApellido || "");
    const response = await axios.get(`https://coloquio-backend.vercel.app/api/search?nombre=${nombreMayus}&apellido=${apellidoMayus || ""}`);
    const cliente = response.data[0];
    console.log("cliente:", cliente);
    if (!cliente) return { error: "Cliente no encontrado" };

    await axios.put(`https://coloquio-backend.vercel.app/api/clients/${cliente.id}`, {
      nombre: data.newNombre,
      apellido: data.newApellido || "",
    });
    return { message: `Cliente actualizado a: ${data.newNombre} ${data.newApellido || ""}` };
  },

  agregar_remito: async (data) => {
    const validationError = validateData(data, ["importe", "fecha", "nombreCliente"]);
    if (validationError) return { error: validationError };
    const nombreMayus = data.nombreCliente.toUpperCase();
    const apellidoMayus = data.apellidoCliente.toUpperCase();

    const response = await axios.get(`https://coloquio-backend.vercel.app/api/search?nombre=${nombreMayus}&apellido=${apellidoMayus || ""}`);
    const cliente = response.data[0];
    const cuentaCorrienteId = cliente?.Cuenta_Corriente[0]?.id;
    if (!cuentaCorrienteId) return { error: "Cuenta corriente no encontrada para el cliente" };

    await axios.post("https://coloquio-backend.vercel.app/api/remito", {
      importe: parseInt(data.importe),
      fecha: data.fecha,
      cuentaCorrienteId,
    });
    return { message: `Remito agregado: Importe ${data.importe}, Fecha ${data.fecha}` };
  },

  agregar_entrega: async (data) => {
    const validationError = validateData(data, ["total", "nombreCliente", "apellidoCliente"]);
    if (validationError) return { error: validationError };

    const nombreMayus = data.nombreCliente.toUpperCase();
    const apellidoMayus = data.apellidoCliente.toUpperCase();

    const response = await axios.get(`https://coloquio-backend.vercel.app/api/search?nombre=${nombreMayus}&apellido=${apellidoMayus || ""}`);
    const cliente = response.data[0];
    const cuentaCorrienteId = cliente?.Cuenta_Corriente[0]?.id;
    if (!cuentaCorrienteId) return { error: "Cuenta corriente no encontrada para el cliente" };

    await axios.post("https://coloquio-backend.vercel.app/api/entregas", {
      total: parseInt(data.total),
      cuentaCorrienteId,
    });
    return { message: `Entrega agregada: Total ${data.total}` };
  },
  obtener_todos_los_clientes: async (data) => {
    const validationError = validateData(data, ["{}"]);
    if (validationError) return { error: validationError };

    const response = await axios.get("https://coloquio-backend.vercel.app/api/clients");
    return { message: `Estos son los clientes: ${JSON.stringify(response.data)}` };
  }
};

// Controlador principal para manejar el mensaje
const getMessaged = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const parsedMessage = await chatService.getMessaged(message);
    if (!parsedMessage || !parsedMessage.action || !parsedMessage.data) {
      return res.status(400).json({ error: "Formato de respuesta incorrecto" });
    }

    const handler = actionHandlers[parsedMessage.action];
    if (!handler) return res.status(400).json({ error: "Acción no reconocida" });

    const result = await handler(parsedMessage.data);
    if (result.error) return res.status(400).json({ error: result.error });

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { getMessaged };