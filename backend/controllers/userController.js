const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const userDetail = req.body;

    if (!userDetail.name || !userDetail.email || !userDetail.password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const data = await User.create(userDetail);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password === user.password) {
      return res.status(200).json({ message: "User login sucessful" });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
