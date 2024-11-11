const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllEntregas = async () => {
  try {
    const entregas = await prisma.entrega.findMany();
    return entregas;
  } catch (error) {
    throw error;
  }
};

const getEntregaByID = async (id) => {
  try {
    const entrega = await prisma.entrega.findUnique({
      where: { id: parseInt(id, 10) },
    });
    return entrega;
  } catch (error) {
    throw error;
  }
};

const addEntrega = async ({ total, cuentaCorrienteId }) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const entrega = await prisma.entrega.create({
        data: { total, cuentaCorrienteId },
      });

      const cuentaCorriente = await prisma.cuenta_Corriente.findUnique({
        where: { id: cuentaCorrienteId },
        include: {
          remitos: { where: { estado: 1 }, orderBy: { importe: "asc" } },
        },
      });

      let remainingEntrega = total;

      for (const remito of cuentaCorriente.remitos) {
        if (remainingEntrega <= 0) break;

        const saldoRemito = remito.saldo ?? remito.importe;

        if (remainingEntrega >= saldoRemito) {
          await prisma.remito.update({
            where: { id: remito.id },
            data: { saldo: 0, estado: 0 },
          });
          remainingEntrega -= saldoRemito;
        } else {
          await prisma.remito.update({
            where: { id: remito.id },
            data: { saldo: saldoRemito - remainingEntrega },
          });
          remainingEntrega = 0;
        }
      }

      const updatedCuentaCorriente = await prisma.cuenta_Corriente.update({
        where: { id: cuentaCorrienteId },
        data: {
          entrega: cuentaCorriente.entrega + total,
          subTotal: cuentaCorriente.remitos.reduce(
            (acc, r) => acc + (r.estado === 1 ? r.saldo ?? r.importe : 0),
            0
          ),
          total:
            cuentaCorriente.remitos.reduce(
              (acc, r) => acc + (r.saldo ?? r.importe),
              0
            ) -
            (cuentaCorriente.entrega + total),
        },
      });

      return { entrega, updatedCuentaCorriente };
    });

    return result;
  } catch (error) {
    throw new Error(
      "Error al agregar la entrega y actualizar los remitos y la cuenta corriente"
    );
  }
};

const updateEntrega = async (id, { total, cuentaCorrienteId }) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const entregaActual = await prisma.entrega.findUnique({
        where: { id: parseInt(id, 10) },
      });

      const cuentaCorriente = await prisma.cuenta_Corriente.findUnique({
        where: { id: cuentaCorrienteId },
        include: { remitos: { orderBy: { importe: "asc" } } },
      });

      let remainingRevert = entregaActual.total;

      for (const remito of cuentaCorriente.remitos) {
        if (remainingRevert <= 0) break;

        const saldoOriginal = remito.saldo ?? remito.importe;
        const saldoRestaurado = Math.min(
          saldoOriginal + remainingRevert,
          remito.importe
        );

        await prisma.remito.update({
          where: { id: remito.id },
          data: {
            saldo: saldoRestaurado,
            estado: saldoRestaurado < remito.importe ? 1 : 0,
          },
        });

        remainingRevert -= saldoRestaurado - saldoOriginal;
      }

      const entrega = await prisma.entrega.update({
        where: { id: parseInt(id, 10) },
        data: { total, cuentaCorrienteId },
      });

      let remainingEntrega = total;
      for (const remito of cuentaCorriente.remitos) {
        if (remainingEntrega <= 0) break;

        const saldoRemito = remito.saldo ?? remito.importe;

        if (remainingEntrega >= saldoRemito) {
          await prisma.remito.update({
            where: { id: remito.id },
            data: { saldo: 0, estado: 0 },
          });
          remainingEntrega -= saldoRemito;
        } else {
          await prisma.remito.update({
            where: { id: remito.id },
            data: { saldo: saldoRemito - remainingEntrega },
          });
          remainingEntrega = 0;
        }
      }

      const updatedCuentaCorriente = await prisma.cuenta_Corriente.update({
        where: { id: cuentaCorrienteId },
        data: {
          entrega: cuentaCorriente.entrega - entregaActual.total + total,
          subTotal: cuentaCorriente.remitos.reduce(
            (acc, r) => acc + (r.estado === 1 ? r.saldo ?? r.importe : 0),
            0
          ),
          total:
            cuentaCorriente.remitos.reduce(
              (acc, r) => acc + (r.saldo ?? r.importe),
              0
            ) -
            (cuentaCorriente.entrega - entregaActual.total + total),
        },
      });

      return { entrega, updatedCuentaCorriente };
    });

    return result;
  } catch (error) {
    throw new Error(
      "Error al actualizar la entrega y los remitos en la cuenta corriente"
    );
  }
};

const getEntregaByCuentaCorrienteId = async (id) => {
  try {
    const entrega = await prisma.entrega.findMany({
      where: { cuentaCorrienteId: parseInt(id, 10) },
    });
    return entrega;
  } catch (error) {
    throw new Error("Error al obtener la entrega por ID de cuenta corriente");
  }
};

module.exports = {
  getAllEntregas,
  getEntregaByID,
  addEntrega,
  updateEntrega,
  getEntregaByCuentaCorrienteId,
};
