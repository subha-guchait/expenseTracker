const signUpForm = document.getElementById("sign-up-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formContainer = document.getElementById("form-container");

signUpForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const userDetail = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    const response = await axios.post(
      "http://localhost:3000/user/signup",
      userDetail
    );
    console.log(response.data);
    signUpForm.reset();
  } catch (err) {
    if (err.response.data.err.errors[0].message == "email must be unique") {
      const p = document.createElement("p");
      p.style.color = "red";
      p.style.fontSize = "14px";
      p.style.fontWeight = "bold";
      p.style.marginTop = "10px";
      p.innerHTML = "Email already Exists";

      formContainer.appendChild(p);
      // signUpForm.reset();
      setTimeout(() => {
        p.remove();
      }, 3000);
    }

    // console.log(err);
  }
});
