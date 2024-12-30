const Sequelize = require("sequelize");

const sequelize = require("../config/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderid: Sequelize.STRING,
  paymentsessionid: Sequelize.STRING,
  orderamount: Sequelize.INTEGER,
  ordercurrency: Sequelize.STRING,
  customeremail: Sequelize.STRING,
  paymentstatus: Sequelize.STRING,
});

module.exports = Order;
