const form = document.getElementById("forgot-password-form");
const email = document.getElementById("email");

form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const existingError = document.getElementById("error-message");
    if (existingError) {
      existingError.remove();
    }

    const emailJson = {
      email: email.value,
    };

    const response = await axios.post(
      "http://localhost:3000/password/forgotpassword",
      emailJson
    );
    alert("Password reset link sent to your email");
    form.reset();
    document.getElementById("success-message").style.display = "block"; // Show success message
    form.style.display = "none";
  } catch (err) {
    const p = document.createElement("p");
    p.id = "error-message";
    p.style.color = "red";
    p.style.fontSize = "14px";
    p.style.fontWeight = "bold";
    p.style.marginTop = "10px";

    if (err.response.status === 404) {
      p.innerHTML = "Email not exists";
    } else {
      p.innerHTML = "Something went wrong";
    }
    console.log(err);

    form.appendChild(p);
  }
});
