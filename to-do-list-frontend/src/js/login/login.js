import { DOMAIN, PORT } from "../constants.js";
import userApi from "../userApi.js";

const BASE_URL = `${DOMAIN}:${PORT}`;

const userApiInstance = new userApi();

const loginForm = document.querySelector(".login-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const resetPasswordLink = document.querySelector(".reset-password-link");

console.log(resetPasswordLink);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailBox.value.trim();
  const password = passwordBox.value;

  if (!email || !password) {
    console.error("Please enter both email and password");
    return;
  }

  const data = await userApiInstance.loginUser(email, password);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  window.location.href = "/";
});

resetPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailBox.value.trim();

  if (!email) {
    console.error("Please enter your email to reset password");
    return;
  }

  await userApiInstance.sendOTP(email);
  window.location.href = "/src/pages/resetPassword.html";
});
