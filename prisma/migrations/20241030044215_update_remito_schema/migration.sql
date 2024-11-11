/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `entregaId` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `totalEntrega` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the `DetalleRemito` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntregaDetalle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cuentaCorrienteId` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaCorrienteId` to the `Remito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `Remito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importe` to the `Remito` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetalleRemito" DROP CONSTRAINT "DetalleRemito_remitoId_fkey";

-- DropForeignKey
ALTER TABLE "Entrega" DROP CONSTRAINT "Entrega_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "EntregaDetalle" DROP CONSTRAINT "EntregaDetalle_entregaId_fkey";

-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_entregaId_fkey";

-- AlterTable
ALTER TABLE "Entrega" DROP COLUMN "clienteId",
ADD COLUMN     "cuentaCorrienteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Remito" DROP COLUMN "clienteId",
DROP COLUMN "entregaId",
DROP COLUMN "subTotal",
DROP COLUMN "total",
DROP COLUMN "totalEntrega",
ADD COLUMN     "cuentaCorrienteId" INTEGER NOT NULL,
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "importe" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "DetalleRemito";

-- DropTable
DROP TABLE "EntregaDetalle";

-- CreateTable
CREATE TABLE "Cuenta_Corriente" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEntrega" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cuenta_Corriente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cuenta_Corriente" ADD CONSTRAINT "Cuenta_Corriente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_cuentaCorrienteId_fkey" FOREIGN KEY ("cuentaCorrienteId") REFERENCES "Cuenta_Corriente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_cuentaCorrienteId_fkey" FOREIGN KEY ("cuentaCorrienteId") REFERENCES "Cuenta_Corriente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
