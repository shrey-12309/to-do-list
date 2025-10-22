import AuthAPI from "../api/AuthAPI.js";
import TokenManagerClass from "../../../utils/tokenManager.js";
import { wait, showAlert } from "../toast.js";

const api = new AuthAPI();
const TokenManager = new TokenManagerClass();

const accessToken = localStorage.getItem("accessToken");
const email = localStorage.getItem("email");
const loginForm = document.querySelector(".login-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const resetPasswordLink = document.querySelector(".reset-password-link");

if (accessToken) {
  window.location.href = "/";
}

loginForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const email = emailBox.value.trim();
    const password = passwordBox.value;

    if (!email || !password) {
      showAlert("Please enter all fields!", "error");
      return;
    }

    const data = await api.loginUser(email, password);

    TokenManager.setTokens(data.accessToken, data.refreshToken);
    showAlert("User logged In successfully!");

    await wait(3000);
    window.location.href = "/";
  } catch (err) {
    showAlert(err.message, "error");
  }
});

resetPasswordLink.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    await api.sendOTP(email);

    showAlert("OTP sent successfully!");
    await wait(3000);
    window.location.href = "/pages/otp?type=reset";
  } catch (err) {
    showAlert(err.message, "error");
  }
});
