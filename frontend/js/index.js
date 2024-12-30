const addExpenseForm = document.getElementById("add-expense-form");
const amount = document.getElementById("amount");
const desc = document.getElementById("desc");
const category = document.getElementById("category");
const premiumBtn = document.getElementById("buy-premium");
const header = document.getElementById("header");

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
    if (!token) {
      window.location.href = "./pages/login.html";
    }
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
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/deleteexpense/${expense.id}`, {
        headers: { Authorization: token },
      });
      document.getElementById(`expense-${expense.id}`).remove();
    } catch (err) {
      console.log(err);
    }
  });
}

premiumBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    let res = await axios.get(
      "http://localhost:3000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );
    console.log(res.data);
    let sessionId = res.data.paymentSessionId;
    let orderId = res.data.orderId;
    // console.log(orderId);
    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };

    let result = await cashfree.checkout(checkoutOptions);

    console.log(result);
    console.log(orderId);

    let response = await axios.post(
      `http://localhost:3000/purchase/updatetransactionstatus/${orderId}`,

      { headers: { Authorization: token } }
    );
    console.log(response);
    if (response.data.orderStatus === "Sucess") {
      alert("You are a Premium User Now");
      premiumBtn.style.visibility = "hidden";
      const premiumHeader = document.createElement("div");
      premiumHeader.id = "premium-header";
      premiumHeader.textContent = "\u{1F389} Welcome, Premium User!";
      header.appendChild(premiumHeader);
    }
  } catch (err) {
    console.log(err);
  }
});

const cashfree = Cashfree({
  mode: "sandbox",
});

const getSessionId = async (token) => {
  try {
    let res = await axios.get(
      "http://localhost:3000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );
    // console.log(res.data);
    return res.data.payment_session_id;
  } catch (err) {
    console.log(err);
  }
};

const verifyPayment = async (token, orderId) => {
  try {
    let response = await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      { orderId: orderId },
      { headers: { Authorization: token } }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
