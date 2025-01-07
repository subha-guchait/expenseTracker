const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

// const mailOptions = {
//   from: {
//     name: "Subhankar 👻",
//     address: "process.env.USER",
//   }, // sender address
//   to: ["shuvankarguchait@gmail.com"], // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// };

// const sendMail = async () => {
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent");
//   } catch (err) {
//     console.log(err);
//   }
// };

// sendMail();

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: {
        name: "Subhankar 👻",
        address: "process.env.USER",
      },
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendMail };
