import AuthAPI from "../api/AuthAPI";
import { showAlert } from "../toast.js";
import TokenManagerClass from "../../../utils/tokenManager.js";
const tokenManager = new TokenManagerClass();

const BASE_URL = "http://localhost:8000";

const api = new AuthAPI();

const profileForm = document.querySelector("#profile-img-form");
const nameEl = document.querySelector(".profile-info-box h5");
const emailEl = document.querySelector(".profile-info-box p");
const profileImg = document.querySelector(".profile-img");
const logoutBtn = document.querySelector(".logout-btn");

profileForm.addEventListener("submit", updateProfile);
document.addEventListener("DOMContentLoaded", fetchUserProfile);

async function fetchUserProfile() {
  try {
    const user = await api.fetchUserDetail();
    console.log(user);

    nameEl.textContent = `Name: ${user.username || "N/A"}`;
    emailEl.innerHTML = `Email ID: <i class="fa-solid fa-envelope me-2"></i> ${
      user.email || "N/A"
    }`;

    if (user.avatar) {
      profileImg.src = `${BASE_URL}/uploads/${user.avatar}`;
    } else {
      profileImg.src = "/svgs/default-profile.svg";
    }
  } catch (err) {
    showAlert(err.message, "error");
  }
}

async function updateProfile(e) {
  try {
    e.preventDefault();

    const profileInput = document.querySelector(".profile-input");

    if (!profileInput.files || !profileInput.files[0]) {
      showAlert("Please upload an image!", "error");
      return;
    }

    await api.updateProfileApi(profileInput.files[0]);

    showAlert("File uploaded successfully!");

    await api.fetchUserDetail();
  } catch (err) {
    showAlert(err.message, "error");
  }
}
logoutBtn.addEventListener("click", () => {
  try {
    tokenManager.clearTokens();
    window.location.href = "/src/pages/login.html";
  } catch (e) {
    showAlert("Unable to logout user! Please try after sometime");
  }
});
