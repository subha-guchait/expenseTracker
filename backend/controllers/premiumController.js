const Sequelize = require("sequelize");

const Expense = require("../models/expense");
const User = require("../models/user");

exports.showLeaderboard = async (req, res, next) => {
  try {
    if (!req.user.ispremiumuser) {
      return res
        .status(403)
        .json({ sucess: false, message: "You are not a premium user" });
    }

    const leaderboardOfUsers = await User.findAll({
      attributes: [
        "id",
        "name",
        [Sequelize.fn("sum", Sequelize.col("expenses.amount")), "totalExpense"],
      ],
      include: [{ model: Expense, attributes: [] }],
      group: ["user.id"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json({ leaderboardOfUsers, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
