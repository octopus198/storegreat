export function setToken(access_token, refresh_token) {
  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);
}

export async function getNewToken(refreshToken) {
  console.log("passed refresh token", refreshToken)
  try {
    const response = await fetch("http://localhost:4000/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    console.log("refesh token response", response)
    if (!response.ok) {
      throw new Error("Failed to get new access token");
    }

    const responseData = await response.json();
    const { access_token, refresh_token } = responseData;
    return { access_token, refresh_token }
  } catch (error) {
    throw new Error("Failed to get new access token");
  }
}


export function clearToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
