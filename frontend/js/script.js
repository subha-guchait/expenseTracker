const signUpForm = document.getElementById("sign-up-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

signUpForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const userDetail = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    console.log(userDetail);

    await axios.post("api", userDetail);
    signUpForm.reset();
  } catch (err) {
    console.log(err);
  }
});
