import AuthAPI from "../api/AuthAPI.js";
import { wait, showAlert } from "../toast.js";

const api = new AuthAPI();
const accessToken = localStorage.getItem("accessToken");

if (accessToken) {
  window.location.href = "/";
}

const resetForm = document.querySelector(".reset-form");
const passwordBox = document.querySelector("#password");
const confirmPasswordBox = document.querySelector("#confirm-password");
const email = localStorage.getItem("email");

resetForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const password = passwordBox.value;
    const confirmPassword = confirmPasswordBox.value;

    if (!password || !confirmPassword) {
      showAlert("Please enter all fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("password and reset password not matched!", "error");
      return;
    }

    await api.resetPassword(email, password);

    showAlert("password changed successfully!", "success");
    await wait(3000);

    window.location.href = "/pages/login";
  } catch (err) {
    showAlert(err.message, "error");
  }
});
