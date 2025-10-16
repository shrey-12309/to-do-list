// import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants.js";

export default class TokenManager {
  setTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  //   static isAuthenticated() {
  //     const token = "accessToken"();
  //     return !!token;
  //   }
}
