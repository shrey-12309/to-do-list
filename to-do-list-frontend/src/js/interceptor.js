import { DOMAIN, PORT } from "../../constants.js";

const BASE_URL = `${DOMAIN}:${PORT}`;

export default async function fetchAuth(url, options = {}, retry = true) {
  console.log("fetch auth used");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/pages/login.html";
    return;
  }

  const headers = {
    ...(options.headers || {}),
    authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && retry) {
      const resData = await res.json();

      if (resData.message === "jwt expired") {
        const renewResponse = await fetch(`${BASE_URL}/user/refreshToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            refreshToken: refreshToken,
          },
        });

        if (!renewResponse.ok) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.reload();
          return;
        }

        const renewData = await renewResponse.json();

        localStorage.setItem("accessToken", renewData.accessToken);
        localStorage.setItem("refreshToken", renewData.refreshToken);

        return fetchAuth(url, options, false);
      }
    }
    return res;
  } catch (error) {
    console.error("fetchAuth error:", error);
    throw error;
  }
}
