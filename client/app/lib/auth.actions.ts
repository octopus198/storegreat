"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error("Faile to login");
    }

    const responseData = await response.json();

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

    console.log("Login successfully", responseData);
  } catch (error) {
    return {
      message: "Database Error: Failed to login.",
    };
  } finally {
    redirect("/dashboard");
  }
}

export async function signout() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
}
