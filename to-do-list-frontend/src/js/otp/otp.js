const DOMAIN = "127.0.0.1";
const PORT = 8000;

const BASE_URL = `${DOMAIN}:${PORT}`;

const otpBox = document.querySelector("#otp");
const verifyBtn = document.querySelector(".verify-btn");
const resendBtn = document.querySelector(".resend-btn");
const email = localStorage.getItem("email");

import userApi from "../userApi.js";
const userApiInstance = new userApi();

async function sendOTP(email) {
  try {
    await userApiInstance.sendOTP(email);
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Failed to send OTP:", err.message);
  }
}

verifyBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const otp = otpBox.value.trim();

  if (!otp) {
    console.error("Please enter OTP");
    return;
  }

  if (!email) {
    console.error("Email not found. Please go back and register again.");
    return;
  }

  try {
    await userApiInstance.verifyOTP(email, otp);
  } catch (err) {
    console.error("OTP verification failed:", err.message);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type");
  console.log(urlParams);

  if (type === "login") {
    window.location.href = "/src/pages/login";
  } else {
    window.location.href = "/src/pages/resetPassword";
  }
});

resendBtn.addEventListener("click", async () => {
  if (!email) {
    console.error("Email not found. Please go back and register again.");
    return;
  }
  await sendOTP(email);
});
