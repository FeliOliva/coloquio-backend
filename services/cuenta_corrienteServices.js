const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const getAllCuentas_Corrientes = async () => {
    try {
        const cuentas_corrientes = await prisma.cuenta_Corriente.findMany();
        return cuentas_corrientes;
    } catch (error) {
        throw error;
    }
};

const getCuenta_CorrienteByID = async (id) => {
    try {
        const cuenta_corriente = await prisma.cuenta_Corriente.findUnique({ where: { id: parseInt(id, 10) } });
        return cuenta_corriente;
    } catch (error) {
        throw error;
    }
}
const getCuenta_CorrienteByClientID = async (id) => {
    try {
        const cuenta_corriente = await prisma.cuenta_Corriente.findMany({ where: { clienteId: parseInt(id, 10) } });
        return cuenta_corriente;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCuentas_Corrientes,
    getCuenta_CorrienteByID,
    getCuenta_CorrienteByClientID
}