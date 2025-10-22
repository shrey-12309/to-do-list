import AuthAPI from "../api/AuthAPI.js";
import showAlert from "../toast.js";

const api = new AuthAPI();
const accessToken = localStorage.getItem("accessToken");

if (accessToken) {
  window.location.href = "/";
}

const registerForm = document.querySelector(".register-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const usernameBox = document.querySelector("#username");

registerForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const username = usernameBox.value.trim();
    const email = emailBox.value.trim();
    const password = passwordBox.value;

    if (!username || !email || !password) {
      showAlert("Please enter all fields", "error");
      return;
    }

    await api.registerUser(username, email, password);

    showAlert(
      "user registered successfully, redirecting for user email verification.",
      "success"
    );

    localStorage.setItem("email", email);

    await api.sendOTP(email);
    showAlert("OTP sent successfully");
    await wait(3000);

    window.location.href = "/pages/otp?type=login";
  } catch (e) {
    showAlert(err.message, "error");
  }
});
