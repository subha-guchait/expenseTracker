console.log("server starting");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const sequelize = require("./config/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const DownloadFile = require("./models/downloadFile");
const forgotPasswordRequest = require("./models/forgotpasswordrequest");

console.log("file fetched");
const app = express();

const acessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  { flags: "a" }
);

app.use(cors());
// app.use(helmet());
app.use(morgan("combined", { stream: acessLogStream }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

//API Routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);
app.use("/download", downloadRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend"));
// });

Expense.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Expense);

Order.belongsTo(User);
User.hasMany(Order);

forgotPasswordRequest.belongsTo(User);
User.hasMany(forgotPasswordRequest);

DownloadFile.belongsTo(User);
User.hasMany(DownloadFile);

console.log("before start server");

const startServer = async (port) => {
  try {
    await sequelize.sync();
    console.log("db synced");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer(process.env.PORT);
