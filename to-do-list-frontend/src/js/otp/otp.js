import AuthAPI from "../api/AuthAPI.js";
import { wait, showAlert } from "../toast.js";

const api = new AuthAPI();
const accessToken = localStorage.getItem("accessToken");
const otpBox = document.querySelector(".otp-input");
const verifyBtn = document.querySelector(".verify-btn");
const resendBtn = document.querySelector(".resend-btn");
const email = localStorage.getItem("email");

// if (accessToken) {
//   window.location.href = "/";
// }

verifyBtn.addEventListener("click", verifyOtp);
resendBtn.addEventListener("click", resendOtp);
window.onload(() => {
  console.log("reset page m h");
});

async function resendOtp() {
  try {
    await api.sendOtp(email);
    showAlert("OTP sent successfully", "success");
  } catch (err) {
    showAlert(err.message, "error");
  }
}

async function verifyOtp() {
  try {
    const otp = otpBox.value.trim();

    if (!otp) {
      showAlert("Please enter OTP", "error");
      return;
    }

    if (!email) {
      showAlert("User not found! Please register to continue!", "error");
      await wait(3000);

      window.location.href = "/pages/register";
      return;
    }

    const data = await api.verifyOtp(email, otp);

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    showAlert("OTP verified successfully!");
    await wait(3000);

    if (type === "login") {
      window.location.href = "/pages/login";
    } else {
      window.location.href = "/pages/resetPassword";
    }
  } catch (err) {
    showAlert(err.message, "error");
  }
}
