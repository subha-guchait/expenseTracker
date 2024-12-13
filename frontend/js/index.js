const addExpenseForm = document.getElementById("add-expense-form");
const amount = document.getElementById("amount");
const desc = document.getElementById("desc");
const category = document.getElementById("category");

addExpenseForm.addEventListener("submit", async () => {
  try {
    e.preventDefault();
    const expenseDetail = {
      amount: amount.value,
      desc: desc.value,
      category: category.value,
    };

    const response = await axios.post("api", expenseDetail);
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const expenses = await axios.get("http://localhost:3000/getexpenses");

    expenses.data.forEach((expense) => {
      displayNewExpense(expense);
    });
  } catch (err) {
    console.log(err);
  }
});

function displayNewExpense(expense) {
  const expenseList = document.getElementById("expenseList");
  const expenseItem = document.createElement("li");
  expenseItem.setAttribute("id", `expense-${expense.id}`);
  expenseItem.innerHTML = `${
    expense.amount + "-" + expense.desc + "-" + expense.category
  }`;

  const dltBtn = document.createElement("button");
  dltBtn.className = "delete-btn";
  dltBtn.textContent = "Delete";
  expenseItem.appendChild(dltBtn);

  expenseList.appendChild(expenseItem);

  dltBtn.addEventListener("click", async () => {
    try {
      await axios.delete(`http://localhost:3000/delete-expense/${expense.id}`);
      document.getElementById(`expense-${expense.id}`).remove();
    } catch (err) {
      console.log(err);
    }
  });
}
