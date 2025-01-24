const Sequelize = require("sequelize");

const sequelize = require("../config/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  totalexpense: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  ispremiumuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
