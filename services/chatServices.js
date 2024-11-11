require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getMessaged = async (message) => {
  const prompt = `
   Eres un asistente de sistema de cuentas corrientes. Responde con un JSON en el siguiente formato, sin texto adicional.
   
   Ejemplos de acciones:
   - Para agregar un cliente: {"action": "agregar_cliente", "data": {"nombre": "Juan", "apellido": ""}}
   - Para actualizar un cliente: {"action": "update_cliente", "data": {"nombreCliente": "Juan", "apellidoCliente": "Checo || "", "newNombre": "Juanito", "newApellido": "Perez || "", }}
   - Para agregar un remito: {"action": "agregar_remito", "data": {"importe": "15000", "fecha": "24/10/2024", "nombreCliente": "Juan", "apellidoCliente": ""}}
   - Para agregar una entrega: {"action": "agregar_entrega", "data": {"total": "10000", "nombreCliente": "Juan", "apellidoCliente": ""}}
   - Para obtener todos los clientes: {"action": "obtener_todos_los_clientes", "data": {}}
   Para actualizar un cliente los primeros dos valores o el primer valor son los valores antiguos y los segundos son los nuevos o el primero es el nuevo.
   Usuario: ${message}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
    max_tokens: 100,
  });

  const aiMessage = response.choices[0].message.content.trim();
  try {
    const parsedMessage = JSON.parse(aiMessage);
    if (!parsedMessage.action || !parsedMessage.data) {
      throw new Error("Respuesta no tiene la estructura esperada.");
    }
    return parsedMessage;
  } catch (error) {
    console.error("Error al interpretar respuesta de OpenAI:", aiMessage);
    throw new Error("Respuesta no válida de OpenAI.");
  }
};

module.exports = { getMessaged };
