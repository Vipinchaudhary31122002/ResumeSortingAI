"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function SignupForm({ switchToLogin }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Sign Up
      </h2>
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          onClick={() => router.push("/dashboard")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  );
}
