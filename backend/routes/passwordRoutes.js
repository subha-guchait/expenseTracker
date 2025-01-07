const express = require("express");

const { resetPasswordMail } = require("../controllers/passwordController");

const router = express.Router();

router.post("/forgotpassword", resetPasswordMail);

module.exports = router;
