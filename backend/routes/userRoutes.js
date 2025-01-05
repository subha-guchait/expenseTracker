const express = require("express");

const userController = require("../controllers/userController");
const userAuth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get(
  "/getupdatedtoken",
  userAuth.authenticate,
  userController.getUpdatedAccessToken
);

module.exports = router;
