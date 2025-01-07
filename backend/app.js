const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const sequelize = require("./config/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

Expense.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Expense);

Order.belongsTo(User);
User.hasMany(Order);

const startServer = async (port) => {
  try {
    await sequelize.sync();
    app.listen(port);
  } catch (err) {
    console.log(err);
  }
};

startServer(3000);
