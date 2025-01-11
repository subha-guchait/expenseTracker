const User = require("../models/user");
const DownloadFile = require("../models/downloadFile");

const downloadRecords = async (id) => {
  const records = await DownloadFile.findAll({ where: { userId: id } });
  return records;
};

module.exports = { downloadRecords };
