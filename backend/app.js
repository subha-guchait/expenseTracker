const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const sequelize = require("./config/database");
const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(expenseRoutes);

Expense.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Expense);

const startServer = async (port) => {
  try {
    await sequelize.sync();
    app.listen(port);
  } catch (err) {
    console.log(err);
  }
};

startServer(3000);
