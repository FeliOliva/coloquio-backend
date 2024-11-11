/*
  Warnings:

  - You are about to drop the column `totalEntrega` on the `Cuenta_Corriente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cuenta_Corriente" DROP COLUMN "totalEntrega",
ADD COLUMN     "entrega" DOUBLE PRECISION NOT NULL DEFAULT 0;
