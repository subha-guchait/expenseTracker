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

    console.log(response);
  } catch (err) {
    const p = document.createElement("p");
    p.id = "error-message";
    p.style.color = "red";
    p.style.fontSize = "14px";
    p.style.fontWeight = "bold";
    p.style.marginTop = "10px";

    if (err.response.data.message === "User not authorized") {
      p.innerHTML = "Password Incorrect";
    } else if (err.response.data.message === "User not found") {
      p.innerHTML = "Email not exists";
    }

    formContainer.appendChild(p);
  }
});
