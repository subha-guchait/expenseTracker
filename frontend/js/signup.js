const signUpForm = document.getElementById("sign-up-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formContainer = document.getElementById("form-container");

signUpForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const existingError = document.getElementById("error-message");
    if (existingError) {
      existingError.remove();
    }

    const userDetail = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    const response = await axios.post(
      "http://localhost:3000/user/signup",
      userDetail
    );
    console.log(response);
    signUpForm.reset();
    if (response.status === 201) {
      window.location.href = "./login.html";
    }
  } catch (err) {
    if (err.response.status == 409) {
      const p = document.createElement("p");
      p.id = "error-message";

      p.innerHTML = "Email already Exists";

      formContainer.appendChild(p);
    }

    console.log(err);
  }
});
