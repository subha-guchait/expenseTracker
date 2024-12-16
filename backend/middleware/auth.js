const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userDetails = await User.findByPk(user.userId);

    req.user = userDetails;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ sucess: false });
  }
};
