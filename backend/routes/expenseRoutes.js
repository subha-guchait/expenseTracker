const express = require("express");

const expenseController = require("../controllers/expenseController");
const userAuth = require("../middleware/auth");

const router = express.Router();

router.get(
  "/getexpenses",
  userAuth.authenticate,
  expenseController.getAllExpenses
);

router.get(
  "/expenses",
  userAuth.authenticate,
  expenseController.getLimitExpenses
);

router.post(
  "/postexpense",
  userAuth.authenticate,
  expenseController.postExpense
);

router.delete(
  "/deleteexpense/:expenseId",
  userAuth.authenticate,
  expenseController.deleteExpense
);

module.exports = router;
