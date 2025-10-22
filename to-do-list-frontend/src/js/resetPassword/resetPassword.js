import { DOMAIN, PORT } from "../../../constants.js";
import userApi from "../userApi.js";

const userApiInstance = new userApi();

const BASE_URL = `${DOMAIN}:${PORT}`;

const resetForm = document.querySelector(".reset-form");
console.log(resetForm);
const passwordBox = document.querySelector("#password");
const confirmPasswordBox = document.querySelector("#confirm-password");
const email = localStorage.getItem("email");

let messageBox = document.querySelector(".message-box");
if (!messageBox) {
  messageBox = document.createElement("div");
  messageBox.className = "message-box";
  resetForm.appendChild(messageBox);
}

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = passwordBox.value;
  const confirmPassword = confirmPasswordBox.value;

  if (!email) {
    showMessage("Email not provided in URL", "error");
    return;
  }

  if (!newPassword || !confirmPassword) {
    showMessage("Please fill all fields", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("Passwords do not match", "error");
    return;
  }

  try {
    await userApiInstance.resetPassword(email, newPassword);

    showMessage("Password reset successful! Please login.", "success");
    setTimeout(() => {
      window.location.href = "/src/pages/login.html";
    }, 2000);
  } catch (err) {
    showMessage("Network error: " + err.message, "error");
  }
});

function showMessage(msg, type) {
  messageBox.innerText = msg;
  messageBox.className = `message-box ${type}`;
}
