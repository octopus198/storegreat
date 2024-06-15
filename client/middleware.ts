import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
async function fetchAccessToken(refreshToken: string) {
  // Implement your logic to fetch a new access token using the refresh token
  const response = await fetch("http://localhost:4000/refresh-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to get refresh token");
  }

  const responseData = await response.json();
  return responseData.tokens;
}

export async function middleware(request: NextRequest, response: NextResponse) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  if (accessToken) {
    try {
      const decodedToken: any = jwtDecode(accessToken); // Decode the JWT token
      console.log("Decoded JWT:", decodedToken);

      // Check if token has expired
      const currentTime = new Date().getTime();
      const expiryTime = decodedToken.exp * 1000;

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);

      if (currentTime > expiryTime) {
        try {
          if (!refreshToken) {
            throw new Error("No refresh token found");
          }

          // Fetch a new access token using the refresh token
          const { access_token, refresh_token } = await fetchAccessToken(
            refreshToken
          );

          console.log(
            "new access token is ",
            access_token,
            "new refresh token is",
            refresh_token
          );

          const res = NextResponse.next();

          // Set the access token cookie
          res.cookies.set("accessToken", access_token, {
            httpOnly: true,
            secure: true,
          });

          // Set the refresh token cookie
          res.cookies.set("refreshToken", refresh_token, {
            httpOnly: true,
            secure: true,
          });

          console.log("Cookies set:", res.cookies.getAll());

          // set headers
          // return response
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set("Authorization", `Bearer ${access_token}`);

          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        } catch (error) {
          console.error("Failed to get refresh token:", error);
          redirect("/login");
          return NextResponse.error();
        }
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Invalid access token:", error);
    }
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// only apply middlewares to dashboard paths
export const config = {
  matcher: ["/dashboard/:path*"],
};
