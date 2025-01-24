const bcrypt = require("bcrypt");

const User = require("../models/user");
const {
  generateAccessToken,
} = require("../services/generateAcesstokenService");
const { downloadRecords, createNewUser } = require("../services/userService");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    const userExsits = await User.findOne({ where: { email: email } });
    if (userExsits) {
      return res.status(409).json({
        sucess: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    const newUser = await createNewUser(name, email, password);

    res.status(201).json({ message: "sucessfully created new user" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const passwordmatch = await bcrypt.compare(password, user.password);

    if (passwordmatch) {
      return res.status(200).json({
        success: true,
        message: "User login sucessful",
        token: generateAccessToken(user.id, user.name, user.ispremiumuser),
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

exports.getUpdatedAccessToken = async (req, res, next) => {
  try {
    return res.status(200).json({
      sucess: true,
      message: "Access token updated",
      token: generateAccessToken(
        req.user.id,
        req.user.name,
        req.user.ispremiumuser
      ),
    });
  } catch (err) {
    console.err("Error updating access token:", err.message);
    res.status(500).json({ message: "Error updating access token" });
  }
};

exports.getDownloadRecords = async (req, res, next) => {
  try {
    const records = await downloadRecords(req.user.id);
    return res.status(200).json({ records, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};
