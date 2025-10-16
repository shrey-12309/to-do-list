const DOMAIN = "127.0.0.1";
const PORT = 8000;

const BASE_URL = `http://${DOMAIN}:${PORT}`;

const resetBtn = document.querySelector(".reset-btn");
const emailBox = document.querySelector("#email");
const newPasswordBox = document.querySelector("#new-password");
const confirmPasswordBox = document.querySelector("#confirm-password");
const messageBox = document.querySelector(".message-box");

resetBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailBox.value.trim();
  const newPassword = newPasswordBox.value;
  const confirmPassword = confirmPasswordBox.value;

  if (!email || !newPassword || !confirmPassword) {
    showMessage("Please fill all fields", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("Passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/user/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Password reset successful! Please login.", "success");
      // redirect after some time
      setTimeout(() => {
        window.location.href = "/pages/login.html";
      }, 2000);
    } else {
      showMessage(data.message || "Password reset failed", "error");
    }
  } catch (err) {
    showMessage("Network error: " + err.message, "error");
  }
});

function showMessage(msg, type) {
  messageBox.innerText = msg;
  messageBox.className = `message-box ${type}`;
}
