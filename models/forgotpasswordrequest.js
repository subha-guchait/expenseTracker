const Sequelize = require("sequelize");

const sequelize = require("../config/database");

const ForgotPasswordRequest = sequelize.define("forgotpasswordrequest", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
