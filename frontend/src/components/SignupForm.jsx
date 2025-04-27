"use client";
import React from "react";
import { useAuth } from "@/api/auth";

export default function SignupForm({ switchToLogin }) {
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    await signup(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Sign Up
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
