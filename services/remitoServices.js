const { PrismaClient } = require("@prisma/client");
const { parse } = require("date-fns");

const prisma = new PrismaClient();

const getAllRemitos = async () => {
  try {
    const detalles = await prisma.remito.findMany();
    return detalles;
  } catch (error) {
    throw error;
  }
};

const getRemitoByID = async (id) => {
  try {
    const remito = await prisma.remito.findUnique({
      where: { id: parseInt(id, 10) },
    });
    return remito;
  } catch (error) {
    throw error;
  }
};

const updateRemitoStatus = async (id, estado) => {
  try {
    await prisma.remito.update({
      where: {
        id: parseInt(id),
      },
      data: {
        estado,
      },
    });
  } catch (error) {
    throw new Error("Error al actualizar el remito");
  }
};

const addRemito = async ({ importe, fecha, cuentaCorrienteId }) => {
  try {
    const parsedFecha = parse(fecha, "dd/MM/yyyy", new Date()); // Convierte "20/10/2024" a un objeto Date
    const result = await prisma.$transaction(async (prisma) => {
      // Crear el nuevo remito
      const newRemito = await prisma.remito.create({
        data: {
          importe,
          saldo: importe,
          fecha: parsedFecha, // Usamos la fecha en formato ISO
          cuentaCorrienteId,
        },
      });

      // Obtener la cuenta corriente actual
      const cuentaCorriente = await prisma.cuenta_Corriente.findUnique({
        where: { id: cuentaCorrienteId },
      });

      if (!cuentaCorriente) {
        throw new Error("Cuenta corriente no encontrada");
      }

      // Actualizar subTotal y total en cuenta corriente
      const updatedCuentaCorriente = await prisma.cuenta_Corriente.update({
        where: { id: cuentaCorrienteId },
        data: {
          subTotal: cuentaCorriente.subTotal + importe,
          total: cuentaCorriente.subTotal + importe - cuentaCorriente.entrega,
        },
      });

      return { newRemito, updatedCuentaCorriente };
    });

    return result;
  } catch (error) {
    console.error("Error en addRemito:", error);
    throw new Error(
      "Error al agregar el remito y actualizar la cuenta corriente"
    );
  }
};

const updateRemito = async (id, { importe, fecha }) => {
  try {
    const parsedFecha = parse(fecha, "dd/MM/yyyy", new Date());
    const result = await prisma.$transaction(async (prisma) => {
      // Obtener el remito actual
      const remitoActual = await prisma.remito.findUnique({
        where: { id: parseInt(id, 10) },
      });

      // Actualizar el remito
      const updatedRemito = await prisma.remito.update({
        where: { id: parseInt(id, 10) },
        data: { importe, fecha: parsedFecha },
      });

      // Obtener y actualizar la cuenta corriente
      const cuentaCorriente = await prisma.cuenta_Corriente.findUnique({
        where: { id: remitoActual.cuentaCorrienteId },
      });

      const updatedCuentaCorriente = await prisma.cuenta_Corriente.update({
        where: { id: cuentaCorriente.id },
        data: {
          subTotal: cuentaCorriente.subTotal - remitoActual.importe + importe,
          total:
            cuentaCorriente.subTotal -
            remitoActual.importe +
            importe -
            cuentaCorriente.entrega,
        },
      });

      return { updatedRemito, updatedCuentaCorriente };
    });

    return result;
  } catch (error) {
    throw new Error("Error al actualizar el remito y la cuenta corriente");
  }
};

const getRemitosByCuentaCorrienteID = async (id) => {
  try {
    const remitos = await prisma.remito.findMany({
      where: { cuentaCorrienteId: parseInt(id, 10) },
    });
    return remitos;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllRemitos,
  getRemitoByID,
  updateRemitoStatus,
  addRemito,
  updateRemito,
  getRemitosByCuentaCorrienteID,
};
