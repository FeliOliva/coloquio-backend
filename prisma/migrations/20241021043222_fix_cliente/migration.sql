/*
  Warnings:

  - Added the required column `clienteId` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Made the column `entregaId` on table `Remito` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_entregaId_fkey";

-- AlterTable
ALTER TABLE "Entrega" ADD COLUMN     "clienteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Remito" ALTER COLUMN "entregaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
