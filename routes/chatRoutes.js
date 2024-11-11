const express = require("express");
const router = express.Router();
const chatControllers = require("../controllers/chatControllers");

router.post("/chat", chatControllers.getMessaged);

module.exports = router;