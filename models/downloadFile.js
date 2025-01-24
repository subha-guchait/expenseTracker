const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const DownloadFile = sequelize.define("downloadFile", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = DownloadFile;
