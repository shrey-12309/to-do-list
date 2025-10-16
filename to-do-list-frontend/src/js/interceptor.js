const BASE_URL = `${DOMAIN}:${PORT}`;

function getLocalAccessToken() {
  return localStorage.getItem("accessToken");
}

function getLocalRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

async function refreshAccessToken() {
  const refreshToken = getLocalRefreshToken();

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Refresh token invalid or expired");
  }

  const data = await response.json();

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data.accessToken;
}

export async function fetchWithAuth(url, options = {}, retry = true) {
  const accessToken = getLocalAccessToken();

  const authOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${BASE_URL}${url}`, authOptions);

  if (response.status === 401 && retry) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retryOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
          "Content-Type": "application/json",
        },
      };

      return await fetch(`${BASE_URL}${url}`, retryOptions);
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.clear();
      window.location.href = "/login";
      throw err;
    }
  }

  return response;
}
