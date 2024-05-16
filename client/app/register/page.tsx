"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      const responseData = await response.json();
      console.log("User created successfully:", responseData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
      <div className="flex items-center justify-center h-full bg-indigo-500 py-10">
        <form
          onSubmit={handleSubmit}
          className="shadow-2xl bg-white rounded-md px-20 py-14"
        >
          <div className="space-y-7">
            <h1 className="text-zinc-700 font-semibold text-2xl">
              Create your StoreGreat account
            </h1>
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: 450 }}
                  className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  type="email"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  type="text"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  type="password"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  type="password"
                />
              </div>
              <div>
                <button
                  className="mt-5 w-full bg-indigo-500 py-2.5 rounded text-white"
                  type="submit"
                >
                  Create account
                </button>
              </div>
            </>
            <p>
              Have an account? <Link href="/signin">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
  );
};

export default RegisterPage;
