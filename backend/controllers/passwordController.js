const { sendMail } = require("../services/emailService");

exports.resetPasswordMail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    await sendMail(
      email,
      "Reset Password",
      "<h2>Reset your password Using bellow link</h2><a href='https://www.google.com/'>Reset Password</a>"
    );
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    res.status(400).json({ message: "Email not sent" });
  }
};
