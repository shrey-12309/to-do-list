const DOMAIN = "127.0.0.1";
const PORT = 8000;

const BASE_URL = `http://${DOMAIN}:${PORT}`;

const loginForm = document.querySelector(".login-form");
const emailBox = document.querySelector("#email");
const passwordBox = document.querySelector("#password");
const resetPasswordLink = document.querySelector(".reset-password-link");

console.log(resetPasswordLink);

async function sendOTP(email) {
  try {
    const res = await fetch(`${BASE_URL}/otp/sendOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.log("Please try Again! Unable to send OTP");
      return;
    }
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Network Error:", err.message);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailBox.value.trim();
  const password = passwordBox.value;

  if (!email || !password) {
    console.error("Please enter both email and password");
    return;
  }

  await loginUser(email, password);
});

async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("access-token", data.accessToken);
      localStorage.setItem("refresh-token", data.refreshToken);

      window.location.href = "/";
    } else {
      console.error("Login Failed:", data.message || "Unknown error");
    }
  } catch (err) {
    console.error("Network Error:", err.message);
  }
}

resetPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailBox.value.trim();

  if (!email) {
    console.error("Please enter your email to reset password");
    return;
  }

  await sendOTP(email);
  window.location.href = "/src/pages/resetPassword.html";
});
