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
