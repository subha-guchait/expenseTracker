const bcrypt = require("bcrypt");

const { sendMail } = require("../services/emailService");
const { generateResetPasswordToken } = require("../services/passwordService");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotpasswordrequest");
const sequelize = require("../config/database");

exports.resetPasswordMail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = await generateResetPasswordToken(email);
    console.log(resetToken);

    await sendMail(
      email,
      "Reset Password",
      `<h2>Reset your password Using bellow link</h2><a href="http://localhost:3000/password/resetpassword/${resetToken}">Reset Password</a>`
    );
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    res.status(400).json({ message: "Email not sent" });
  }
};

exports.resetPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id },
    });

    if (!forgotPasswordRequest || !forgotPasswordRequest.isactive) {
      return res.status(404).json({ message: "Invalid or Expired Link" });
    }

    res.send(`
            <html>
                <form action='/password/updatepassword/${id}' method="POST">

                <label for='newPassword'>Enter New Password:</label>

                <input type='password' id='newPassword' name='newPassword' required>

                <button type='submit'>Reset</button>

                </form>
            </html>
        `);
  } catch (err) {
    res.status(400).json({ message: "Invalid or Expired Link" });
  }
};

exports.updatePassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { newPassword } = req.body;
    const resetPasswordRequestId = req.params.id;

    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id: resetPasswordRequestId },
    });

    if (!forgotPasswordRequest || !forgotPasswordRequest.isactive) {
      return res.status(404).json({ message: "Invalid or Expired Link" });
    }

    const user = await User.findOne({
      where: { id: forgotPasswordRequest.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const saltrounds = 10;
    bcrypt.hash(newPassword, saltrounds, async (err, hash) => {
      await user.update({ password: hash }, { transaction: t });
      await forgotPasswordRequest.update(
        { isactive: false },
        { transaction: t }
      );

      t.commit();
      return res
        .status(200)
        .send("<html><h3>Password updated successfully</h3></html>");
    });
  } catch (err) {
    await t.rollback();
    res
      .status(400)
      .json({ sucess: false, message: "Failed to update password" });
  }
};
