const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);

const startServer = async (port) => {
  try {
    await sequelize.sync();
    app.listen(port);
  } catch (err) {
    console.log(err);
  }
};

startServer(3000);
