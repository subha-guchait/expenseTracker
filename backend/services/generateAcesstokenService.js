const jwt = require("jsonwebtoken");

exports.generateAccessToken = (id, name, isPremium) => {
  return jwt.sign(
    { userId: id, name: name, isPremium: isPremium },
    process.env.JWT_SECRET
  );
};
