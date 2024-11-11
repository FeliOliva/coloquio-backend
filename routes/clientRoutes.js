const express = require("express");
const router = express.Router();
const clientControllers = require("../controllers/clientControllers");

router.get("/clients", clientControllers.getAllClients);
router.get("/clients/:id", clientControllers.getClientByID);
router.post("/clients", clientControllers.addClient);
router.delete("/clients/:id", clientControllers.dropClient);
router.post("/clients/:id", clientControllers.upClient);
router.put("/clients/:id", clientControllers.updateClients);
router.get("/search", clientControllers.searchClients);

module.exports = router;
