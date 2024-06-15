"use server";
import { cookies } from "next/headers"; // Import the cookies module
import { redirect } from "next/navigation";

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export async function customFetch(url: string, options: FetchOptions = {}) {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // if receive 401 or 403 status, we call the refresh token api
  if (response.status === 401 || response.status === 403) {
    console.log("we caught the error");
    // call the fetchRefreshToken. if there's an error, meaning the refresh token is invalid, we need user to login
    try {    
      let refreshToken = cookieStore.get("refreshToken")?.value;

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch("http://localhost:4000/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Fail to get refresh token");
      }
    
      const responseData = await response.json();
      console.log("the new tokens are ", responseData);

      console.log("message 1 works")
  
      cookies().set({
        name: "accessToken",
        value: responseData.tokens.access_token,
        httpOnly: true,
      });
      console.log("message 2 works")
      cookies().set({
        name: "refreshToken",
        value: responseData.tokens.refresh_token,
        httpOnly: true,
      });
      console.log("message 3 works")

      accessToken = cookieStore.get("accessToken")?.value;

      console.log("the second access token is", accessToken)

      // Retry the original request with the new access token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return retryResponse;
    } catch (error) {
      console.log("Failed to refresh token, redirecting to login...");
      redirect("/login");
    }
  }

  return response;
}

// here we fetch the refresh token

export async function fetchRefreshToken() {
  const cookieStore = cookies();
  let refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  // refresh_token
  try {
    const response = await fetch("http://localhost:4000/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    console.log("can we get refresh token? ", response);

    if (!response.ok) {
      throw new Error("Fail to get refresh token");
    }

    const responseData = await response.json();
    console.log("the new tokens are ", responseData);

    cookies().set({
      name: "accessToken",
      value: responseData.tokens.access_token,
      httpOnly: true,
    });

    cookies().set({
      name: "refreshToken",
      value: responseData.tokens.refresh_token,
      httpOnly: true,
    });

    // return responseData;
  } catch (error) {
    return {
      message: "Database Error: Failed to login.",
    };
  }
}


