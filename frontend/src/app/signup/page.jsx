"use client";
import React, { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    e.preventDefault();
    // Here you can connect to backend or authentication service
    console.log("Signing up with:", { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
