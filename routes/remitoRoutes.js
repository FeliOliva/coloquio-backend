const express = require("express");
const router = express.Router();
const remitoControllers = require("../controllers/remitoControllers");

router.get("/remito", remitoControllers.getAllRemitos);
router.get("/remito/:id", remitoControllers.getRemitoByID);
router.post("/remito", remitoControllers.addRemito);
router.delete("/remito/:id", remitoControllers.dropRemito);
router.post("/remito/:id", remitoControllers.upRemito);
router.put("/remito/:id", remitoControllers.updateRemito);
router.get("/remito/cuenta_corriente/:id", remitoControllers.getRemitosByCuentaCorrienteID);

module.exports = router;