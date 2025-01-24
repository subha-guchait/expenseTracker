const express = require("express");

const { downloadAllExpenses } = require("../controllers/downloadController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/allexpenses", authenticate, downloadAllExpenses);

module.exports = router;
