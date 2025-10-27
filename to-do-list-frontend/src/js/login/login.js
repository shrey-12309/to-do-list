import AuthAPI from "../api/AuthAPI.js";
import TokenManager from "../../../utils/tokenManager.js";
import { wait, showAlert } from "../toast.js";

const api = new AuthAPI();
const tokenInstance = new TokenManager();

const accessToken = localStorage.getItem("accessToken");
const email = localStorage.getItem("email");
const loginForm = document.querySelector(".login-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const resetPasswordLink = document.querySelector(".reset-password-link");

if (accessToken) {
  window.location.href = "/";
}

loginForm.addEventListener("submit", userLogin);
resetPasswordLink.addEventListener("click", resetPassword);

async function resetPassword(e) {
  try {
    e.preventDefault();

    await api.sendOtp(email);

    showAlert("OTP sent successfully!");
    await wait(3000);

    window.location.href = "/pages/otp?type=reset";
  } catch (err) {
    showAlert(err.message, "error");
  }
}

async function userLogin(e) {
  try {
    e.preventDefault();

    const email = emailBox.value.trim();
    const password = passwordBox.value;

    if (!email || !password) {
      showAlert("Please enter all fields!", "error");
      return;
    }

    const data = await api.loginUser(email, password);

    tokenInstance.setTokens(data.accessToken, data.refreshToken);
    showAlert("User logged In successfully!");

    await wait(3000);
    window.location.href = "/";
  } catch (err) {
    showAlert(err.message, "error");

    if (err.message.includes("Account not verified")) {
      await wait(3000);
      await api.sendOtp(email);
      window.location.href = "/pages/otp?type=login";
    }
  }
}
