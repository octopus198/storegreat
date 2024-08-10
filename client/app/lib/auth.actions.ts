"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
const FormSchema = z.object({
  _id: z.string(),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
const Login = FormSchema.omit({
  _id: true,
});
export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function login(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = Login.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    console.log("flatten errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to login.",
    };
  }

  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error("Fail to login");
    }
    const responseData = await response.json();

    cookies().set({
      name: "accessToken",
      value: responseData.tokens.access_token,
      httpOnly: true,
    });

    console.log("did this work?")
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
