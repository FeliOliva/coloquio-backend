-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remito" (
    "id" SERIAL NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "entregaId" INTEGER NOT NULL,
    "totalEntrega" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Remito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleRemito" (
    "id" SERIAL NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "remitoId" INTEGER NOT NULL,

    CONSTRAINT "DetalleRemito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" SERIAL NOT NULL,
    "fechaUltimaModif" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregaDetalle" (
    "id" SERIAL NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "entregaId" INTEGER NOT NULL,

    CONSTRAINT "EntregaDetalle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRemito" ADD CONSTRAINT "DetalleRemito_remitoId_fkey" FOREIGN KEY ("remitoId") REFERENCES "Remito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaDetalle" ADD CONSTRAINT "EntregaDetalle_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
