import { DOMAIN, PORT } from "../constants.js";
import userApi from "./userApi.js";

const userApiInstance = new userApi();

const BASE_URL = `${DOMAIN}:${PORT}`;

const registerForm = document.querySelector(".signup-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const usernameBox = document.querySelector("#username");
console.log(registerForm);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameBox.value.trim();
  const email = emailBox.value.trim();
  const password = passwordBox.value;

  if (!username || !email || !password) {
    console.error("Please enter all fields");
    return;
  }

  try {
    await userApiInstance.registerUser(username, email, password);

    await userApiInstance.sendOTP(email);

    localStorage.setItem("email", email);
    window.location.href = "/src/pages/otp.html";
  } catch (err) {
    console.error("Registration Failed:", err.message);
  }
});
