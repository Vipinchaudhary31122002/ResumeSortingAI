"use client";
import React from "react";
import { useAuth } from "@/api/auth";

export default function LoginForm({ switchToSignup }) {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    await login(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Login
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>

      <p className="text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-indigo-600 font-semibold hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
