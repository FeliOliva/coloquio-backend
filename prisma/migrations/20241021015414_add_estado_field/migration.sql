-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "estado" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "DetalleRemito" ADD COLUMN     "estado" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Entrega" ADD COLUMN     "estado" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "EntregaDetalle" ADD COLUMN     "estado" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Remito" ADD COLUMN     "estado" INTEGER NOT NULL DEFAULT 1;
