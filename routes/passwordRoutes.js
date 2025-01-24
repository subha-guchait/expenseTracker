const express = require("express");

const {
  resetPasswordMail,
  resetPassword,
  updatePassword,
} = require("../controllers/passwordController");

const router = express.Router();

router.post("/forgotpassword", resetPasswordMail);
router.get("/resetpassword/:id", resetPassword);
router.post("/updatePassword/:id", updatePassword);

module.exports = router;
