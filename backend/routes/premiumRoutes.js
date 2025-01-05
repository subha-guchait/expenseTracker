const express = require("express");

const premiumController = require("../controllers/premiumController");
const userAuth = require("../middleware/auth");

const router = express.Router();

router.get(
  "/leaderboard",
  userAuth.authenticate,
  premiumController.showLeaderboard
);

module.exports = router;
