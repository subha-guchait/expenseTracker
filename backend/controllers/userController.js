const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, name: name }, process.env.JWT_SECRET);
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      //   console.log(err);
      await User.create({ name, email, password: hash });
      res.status(201).json({ message: "sucessfully created new user" });
    });
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
        token: generateAccessToken(user.id, user.name),
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
