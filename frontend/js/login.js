const logInForm = document.getElementById("log-in-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formContainer = document.getElementById("form-container");

logInForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const existingError = document.getElementById("error-message");
    if (existingError) {
      existingError.remove();
    }

    const logInDetail = {
      email: email.value,
      password: password.value,
    };

    const response = await axios.post(
      "http://localhost:3000/user/login",
      logInDetail
    );
    // console.log(response);
    alert("User logged in Sucessfully");
    localStorage.setItem("token", response.data.token);
    window.location.href = "../index.html";
  } catch (err) {
    const p = document.createElement("p");
    p.id = "error-message";
    p.style.color = "red";
    p.style.fontSize = "14px";
    p.style.fontWeight = "bold";
    p.style.marginTop = "10px";

    if (err.response.status === 401) {
      p.innerHTML = "Password Incorrect";
    } else if (err.response.status === 404) {
      p.innerHTML = "Email not exists";
    } else {
      p.innerHTML = "Something went wrong";
    }
    console.log(err);

    formContainer.appendChild(p);
  }
});
