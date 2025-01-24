const addExpenseForm = document.getElementById("add-expense-form");
const amount = document.getElementById("amount");
const desc = document.getElementById("desc");
const category = document.getElementById("category");
const premiumBtn = document.getElementById("buy-premium");
const header = document.getElementById("header");
const profileBtn = document.getElementById("profileButton");
const pageLimit = document.getElementById("pageLimit");

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

addExpenseForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const expenseDetail = {
      amount: amount.value,
      desc: desc.value,
      category: category.value,
    };

    const token = localStorage.getItem("token");

    await axios.post(`${API_BASE_URL}/expense/postexpense`, expenseDetail, {
      headers: { Authorization: token },
    });

    fetchExpenses(1);
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

    const user = parseJwt(token);

    if (user.isPremium) {
      showPremium();
    }

    fetchExpenses(1);
  } catch (err) {
    console.log(err);
  }
});

function displayExpense(expense) {
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
      await axios.delete(
        `${API_BASE_URL}/expense/deleteexpense/${expense.id}`,
        {
          headers: { Authorization: token },
        }
      );
      document.getElementById(`expense-${expense.id}`).remove();
    } catch (err) {
      console.log(err);
    }
  });
}

async function fetchExpenses(page = 1) {
  const limit = localStorage.getItem("pageLimit") || 5;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/expense/expenses?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: token },
      }
    );

    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = ""; // Clear existing list

    response.data.expenses.forEach((expense) => displayExpense(expense));

    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = ""; // Clear existing pagination

    for (let i = 1; i <= response.data.lastPage; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === parseInt(page)) {
        pageButton.disabled = true; // Disable current page button
      }
      pageButton.onclick = () => fetchExpenses(i);
      paginationDiv.appendChild(pageButton);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred. Please try again.");
  }
}

pageLimit.onchange = () => {
  const pageLimitValue = document.getElementById("pageLimit").value;
  localStorage.setItem("pageLimit", pageLimitValue);
  fetchExpenses(1);
};

premiumBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    let res = await axios.get("${API_BASE_URL}/purchase/premiummembership", {
      headers: { Authorization: token },
    });
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
      `${API_BASE_URL}/purchase/updatetransactionstatus/${orderId}`,

      { headers: { Authorization: token } }
    );
    console.log(response);
    if (response.data.orderStatus === "Sucess") {
      await updateAccessToken();
      alert("You are a Premium User Now");
      showPremium();
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
    let res = await axios.get(`${API_BASE_URL}/purchase/premiummembership`, {
      headers: { Authorization: token },
    });

    return res.data.payment_session_id;
  } catch (err) {
    console.log(err);
  }
};

const verifyPayment = async (token, orderId) => {
  try {
    let response = await axios.post(
      `${API_BASE_URL}/purchase/updatetransactionstatus`,
      { orderId: orderId },
      { headers: { Authorization: token } }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

const showPremium = () => {
  premiumBtn.style.display = "none";
  const premiumHeader = document.createElement("div");
  premiumHeader.id = "premium-header";
  premiumHeader.textContent = "Premium";
  const premium = document.getElementById("premium");
  premium.appendChild(premiumHeader);
  const showLeaderboardBtn = document.createElement("button");
  showLeaderboardBtn.textContent = "Leaderboard";
  showLeaderboardBtn.id = "show-leaderboard";

  const leaderboardBtnSection = document.getElementById(
    "leaderBoardBtnSection"
  );
  leaderboardBtnSection.appendChild(showLeaderboardBtn);
  showLeaderboardBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/premium/leaderboard`, {
        headers: { Authorization: token },
      });
      console.log(response.data);
      const leaderboardList = document.getElementById("leaderList");
      leaderboardList.innerHTML = "";
      response.data.leaderboardOfUsers.forEach((user) => {
        const userItem = document.createElement("li");
        userItem.textContent = `${user.name} - ${user.totalexpense}`;
        leaderboardList.appendChild(userItem);
      });
      const leaderboardSection = document.getElementById("leaderboardSection");
      leaderboardSection.style.display = "block";

      leaderboardSection.scrollIntoView({ behavior: "smooth" });

      showLeaderboardBtn.style.display = "none";
      const closeLeaderboardBtn = document.createElement("button");
      closeLeaderboardBtn.textContent = "Hide Leaderboard";
      closeLeaderboardBtn.id = "close-leaderboard";
      leaderboardBtnSection.appendChild(closeLeaderboardBtn);
      closeLeaderboardBtn.addEventListener("click", () => {
        leaderboardSection.style.display = "none";
        closeLeaderboardBtn.remove();
        showLeaderboardBtn.style.display = "block";
      });
    } catch (err) {
      console.log(err);
    }
  });

  const downloadSection = document.getElementById("downloadSection");
  downloadSection.style.display = "block";

  const downloadBtn = document.getElementById("download-expenses");
  downloadBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/download/allexpenses`, {
        headers: { Authorization: token },
      });
      console.log(response.data);

      const a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.target = "_blank";
      a.download = "expenses.pdf";
      a.click();
    } catch (err) {
      console.log(err);
    }
  });

  const previousDownloadBtn = document.getElementById("previous-downloads");
  previousDownloadBtn.addEventListener("click", async () => {
    displayRecords();
  });
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const updateAccessToken = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/getupdatedtoken`, {
    headers: { Authorization: token },
  });
  localStorage.setItem("token", response.data.token);
};

async function displayRecords() {
  try {
    document.getElementById("recordsDiv").style.display = "block";
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/downloadrecords`, {
      headers: { Authorization: token },
    });

    document.getElementById("records").innerHTML = "";

    response.data.records.forEach((record) => {
      const ul = document.getElementById("records");
      const li = document.createElement("li");
      const rawDate = new Date(record.createdAt);

      li.textContent = formatDate(rawDate);

      const dlink = document.createElement("a");
      dlink.href = record.url;
      dlink.target = "_blank";
      dlink.textContent = "Download";
      dlink.download = "expenses.pdf";

      li.appendChild(dlink);
      ul.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

function formatDate(rawDate) {
  const date = new Date(rawDate);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format the date as "ddd dd mmmm yyyy"
  const formattedDateTime = `${dayOfWeek} ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

profileBtn.addEventListener("click", () => {
  const profileMenu = document.getElementById("profileMenu");
  profileMenu.style.display =
    profileMenu.style.display === "none" || profileMenu.style.display === ""
      ? "block"
      : "none";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./pages/login.html";
});

// Close the dropdown if clicked outside
document.addEventListener("click", (e) => {
  const profileMenu = document.getElementById("profileMenu");
  if (
    profileMenu.style.display === "block" &&
    !profileMenu.contains(e.target) &&
    !profileBtn.contains(e.target)
  ) {
    profileMenu.style.display = "none";
  }
});
