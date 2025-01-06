const Expense = require("../models/expense");
const User = require("../models/user");

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    return res.status(200).json({ expenses, sucess: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};

exports.postExpense = async (req, res, next) => {
  try {
    const { amount, desc, category } = req.body;

    if (!amount || !desc || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }

    const expense = await req.user.createExpense({ amount, desc, category });

    const user = await User.findByPk(req.user.id);

    await user.increment("totalexpense", { by: amount });

    return res.status(201).json({ expense, sucess: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;

    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }
    const user = await User.findByPk(req.user.id);
    await expense.destroy();
    await user.decrement("totalexpense", { by: expense.amount });

    return res
      .status(200)
      .json({ sucess: true, message: "expense deleted sucessfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
