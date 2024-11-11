-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_entregaId_fkey";

-- AlterTable
ALTER TABLE "Remito" ALTER COLUMN "subTotal" SET DEFAULT 0,
ALTER COLUMN "entregaId" DROP NOT NULL,
ALTER COLUMN "totalEntrega" SET DEFAULT 0,
ALTER COLUMN "total" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;
