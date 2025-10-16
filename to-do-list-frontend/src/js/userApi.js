import { DOMAIN, PORT } from "../../constants.js";
import TokenManager from "../../utils/tokenManager.js";

const BASE_URL = `${DOMAIN}:${PORT}`;
const tokenManager = new TokenManager();

export default class userApi {
  verifyOTP = async (email, otp) => {
    try {
      const res = await fetch(`${BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("OTP verified successfully!");
        window.location.href = "/pages/login.html";
      } else {
        console.error(
          "Unable to verify user:",
          data.message || "Unknown error"
        );
      }
    } catch (err) {
      console.error("Network Error:", err.message);
    }
  };

  sendOTP = async (email) => {
    try {
      const res = await fetch(`${BASE_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Please try again! Unable to send OTP");
        throw new Error(errorData.message || "OTP failed");
      }

      console.log("OTP sent successfully");
    } catch (e) {
      console.error("Network Error:", e.message);
      throw e;
    }
  };

  loginUser = async (email, password) => {
    try {
      console.log(`${BASE_URL}/auth/login`);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      console.log("Login successful:", data);
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (e) {
      console.error("Error logging in user:", e.message);
      throw e;
    }
  };

  registerUser = async (username, email, password) => {
    try {
      console.log(username);
      console.log(email);
      console.log(password);
      const res = await fetch(`${BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      console.log(res);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Register user failed");
      }

      const data = await res.json();

      console.log("Registration successful:", data);
      return data;
    } catch (e) {
      console.error("Error registering user:", e.message);
      throw e;
    }
  };

  refreshToken = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${BASE_URL}/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      tokenManager.setTokens(data.accessToken, data.refreshToken);

      return data;
    } catch (error) {
      console.error("Token refresh error:", error.message);
      tokenManager.clearTokens();
      throw error;
    }
  };

  logout = () => {
    tokenManager.clearTokens();
    window.location.href = "/pages/login.html";
  };

  resetPassword = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/otp/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Unable to reset password");
        throw new Error(errorData.message || "OTP failed");
      }

      console.log("password reset successfully");
    } catch (e) {
      console.error("unable to reset password", e);
      throw e;
    }
  };
}
