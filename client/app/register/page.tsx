"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../lib/auth.actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = {
      email,
      username,
      password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      console.log(response);
      const responseData = await response.json();
      console.log("User created successfully:", responseData);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <main className="flex items-center justify-center md:h-screen bg-indigo-200">
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
              Enter email, username, and password to create your Storegreat
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {/* <Button type="submit">Log in</Button> */}
              <LoginButton />
              {/* <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div> */}
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with Facebook
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>

    // <div className="flex items-center justify-center h-screen bg-indigo-500 py-10">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="shadow-2xl bg-white rounded-md px-20 py-14"
    //   >
    //     <div className="space-y-7">
    //       <h1 className="text-zinc-700 font-semibold text-2xl">
    //         Create your StoreGreat account
    //       </h1>
    //       <>
    //         <div>
    //           <label
    //             htmlFor="email"
    //             className="block text-sm font-medium leading-6 text-gray-900 mb-2"
    //           >
    //             Email
    //           </label>
    //           <input
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             style={{ width: 450 }}
    //             className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    //             type="email"
    //           />
    //         </div>

    //         <div>
    //           <label
    //             htmlFor="username"
    //             className="block text-sm font-medium leading-6 text-gray-900 mb-2"
    //           >
    //             Username
    //           </label>
    //           <input
    //             value={username}
    //             onChange={(e) => setUsername(e.target.value)}
    //             className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    //             type="text"
    //           />
    //         </div>
    //         <div>
    //           <label
    //             htmlFor="password"
    //             className="block text-sm font-medium leading-6 text-gray-900 mb-2"
    //           >
    //             Password
    //           </label>
    //           <input
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    //             type="password"
    //           />
    //         </div>
    //         <div>
    //           <label
    //             htmlFor="confirm_password"
    //             className="block text-sm font-medium leading-6 text-gray-900 mb-2"
    //           >
    //             Confirm Password
    //           </label>
    //           <input
    //             value={confirmPassword}
    //             onChange={(e) => setConfirmPassword(e.target.value)}
    //             className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    //             type="password"
    //           />
    //         </div>
    //         <div>
    //           <button
    //             className="mt-5 w-full bg-indigo-500 py-2.5 rounded text-white"
    //             type="submit"
    //           >
    //             Create account
    //           </button>
    //         </div>
    //       </>
    //       <p>
    //         Have an account? <Link className="font-medium underline" href="/login">Log in</Link>
    //       </p>
    //     </div>
    //   </form>
    // </div>
  );
};

export default RegisterPage;

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-4 w-full bg-indigo-600 hover:bg-indigo-400"
      aria-disabled={pending}
    >
      Sign up
    </Button>
  );
}
