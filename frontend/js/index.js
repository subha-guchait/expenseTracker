const addExpenseForm = document.getElementById("add-expense-form");
const amount = document.getElementById("amount");
const desc = document.getElementById("desc");
const category = document.getElementById("category");

addExpenseForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const expenseDetail = {
      amount: amount.value,
      desc: desc.value,
      category: category.value,
    };

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:3000/postexpense",
      expenseDetail,
      {
        headers: { Authorization: token },
      }
    );

    displayNewExpense(response.data.expense);
    addExpenseForm.reset();
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/getexpenses", {
      headers: { Authorization: token },
    });

    response.data.expenses.forEach((expense) => {
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
      console.log("dltbtn clicked1");
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/deleteexpense/${expense.id}`, {
        headers: { Authorization: token },
      });
      console.log("dltbtn clicked 2");
      document.getElementById(`expense-${expense.id}`).remove();
    } catch (err) {
      console.log(err);
    }
  });
}
