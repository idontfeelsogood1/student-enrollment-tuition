const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

router.get("/", healthController.getStatus);
router.get("/db", healthController.getDatabaseStatus);

module.exports = router;
