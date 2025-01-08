const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotpasswordrequest");

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = uuidv4();

  await ForgotPasswordRequest.create({
    id: resetToken,
    isactive: true,
    userId: user.id,
  });

  return resetToken;
};

module.exports = { generateResetPasswordToken };
