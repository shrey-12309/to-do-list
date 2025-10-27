import { DOMAIN, PORT } from "../../../constants.js";
import TokenManagerClass from "../../../utils/tokenManager.js";

const TokenManager = new TokenManagerClass();
const BASE_URL = `${DOMAIN}:${PORT}`;

export default class AuthAPI {
  registerUser = async (username, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      console.log(res);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed!");
      }

      return;
    } catch (err) {
      throw err;
    }
  };

  loginUser = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed!");
      }

      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  verifyOtp = async (email, otp) => {
    try {
      const res = await fetch(`${BASE_URL}/user/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        return;
      } else {
        throw new Error(data.error || "OTP verification failed!");
      }
    } catch (err) {
      throw err;
    }
  };

  sendOtp = async (email) => {
    try {
      const res = await fetch(`${BASE_URL}/user/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unable to send OTP!");
      }
    } catch (err) {
      throw err;
    }
  };

  resetPassword = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to Reset Password!");
      }
    } catch (err) {
      throw err;
    }
  };

  refreshToken = async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const res = await fetch(`${BASE_URL}/user/auth/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unable to refresh token!");
      }

      const data = await res.json();
      TokenManager.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (err) {
      TokenManager.clearTokens();
      throw err;
    }
  };
  updateProfile = async (form) => {
    try {
      const formData = new FormData(form);

      const res = await fetch(
        `${BASE_URL}/user/auth/update-profile`,
        formData,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "unable to upload profile image!");
      }
    } catch (err) {
      throw err;
    }
  };

  fetchUserDetail = async () => {
    const res = await fetch(`${BASE_URL}/user/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unable to load user details!");
    }

    console.log("THIS IS OUTPUT in FETCH USER DETAIL", data);
    return data.userData;
  };
}
