const User = require("../models/user");
const DownloadFile = require("../models/downloadFile");
const bcrypt = require("bcrypt");

const downloadRecords = async (id) => {
  const records = await DownloadFile.findAll({ where: { userId: id } });
  return records;
};

const createNewUser = async (name, email, password) => {
  try {
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return newUser;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create a new user: " + err);
  }
};

module.exports = { downloadRecords, createNewUser };
