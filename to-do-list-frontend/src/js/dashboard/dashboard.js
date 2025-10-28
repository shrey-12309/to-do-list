const signupBtn = document.querySelector(".signup");
const loginBtn = document.querySelector(".login");

signupBtn.addEventListener("click", () => {
  try {
    window.location.href = "/src/pages/signup.html";
  } catch (e) {
    showAlert("Unable to signup");
  }
});

loginBtn.addEventListener("click", () => {
  try {
    window.location.href = "/src/pages/login.html";
  } catch (e) {
    showAlert("Unable to login");
  }
});
