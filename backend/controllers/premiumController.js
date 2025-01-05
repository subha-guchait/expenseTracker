const Expense = require("../models/expense");
const User = require("../models/user");

exports.showLeaderboard = async (req, res, next) => {
  try {
    if (!req.user.ispremiumuser) {
      return res
        .status(403)
        .json({ sucess: false, message: "You are not a premium user" });
    }
    const expenses = await Expense.findAll();
    const users = await User.findAll();
    let userTotalExpenses = {};

    expenses.forEach((expense) => {
      if (userTotalExpenses[expense.userId]) {
        userTotalExpenses[expense.userId] += expense.amount;
      } else {
        userTotalExpenses[expense.userId] = expense.amount;
      }
    });
    let userLeaderboardDetails = [];
    users.forEach((user) => {
      userLeaderboardDetails.push({
        name: user.name,
        totalExpense: userTotalExpenses[user.id] || 0,
      });
    });
    userLeaderboardDetails.sort((a, b) => b.totalExpense - a.totalExpense);

    res.status(200).json({ userLeaderboardDetails, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
