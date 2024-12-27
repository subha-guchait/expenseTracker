const Expense = require("../models/expense");

exports.getExpenses = async (req, res, next) => {
  try {
    // console.log(req.user);
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
    console.log({ amount, desc, category });

    const expense = await req.user.createExpense({ amount, desc, category });

    // const expense = await Expense.create({
    //     amount,
    //     desc,
    //     category,
    //     userId: req.user.id,
    //   });

    return res.status(201).json({ expense, sucess: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;

    const response = await Expense.destroy({
      where: {
        userId: req.user.id,
        id: expenseId,
      },
    });
    console.log(response);
    return res
      .status(200)
      .json({ sucess: true, message: "expense deleted sucessfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
