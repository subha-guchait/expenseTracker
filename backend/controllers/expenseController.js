const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../config/database");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    return res.status(200).json({ expenses, sucess: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};

exports.getLimitExpenses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit; // starting index opf database query

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      expenses,
      currentPage: page,
      totalExpense: count,
      hasPreviousPage: page > 1,
      hasNextpage: page < totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      lastPage: totalPages,
    });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, desc, category } = req.body;

    if (!amount || !desc || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }

    const expense = await req.user.createExpense(
      { amount, desc, category },
      { transaction: t }
    );

    await User.increment(
      { totalexpense: amount },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    return res.status(201).json({ expense, sucess: true });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.expenseId;

    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    await expense.destroy({ transaction: t });

    await User.decrement(
      { totalexpense: expense.amount },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();

    return res
      .status(200)
      .json({ sucess: true, message: "expense deleted sucessfully" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
