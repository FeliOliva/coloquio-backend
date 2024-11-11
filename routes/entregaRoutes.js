const express = require("express");
const router = express.Router();
const entregaControllers = require("../controllers/entregaControllers");

router.get("/entregas", entregaControllers.getAllEntregas);
router.get("/entregas/:id", entregaControllers.getEntregaByID);
router.post("/entregas", entregaControllers.addEntrega);
router.put("/entregas/:id", entregaControllers.updateEntrega); //todavia no funciona
router.get(
  "/entregasxcuenta_corriente/:id",
  entregaControllers.getEntregaByCuentaCorrienteId
);

module.exports = router;
