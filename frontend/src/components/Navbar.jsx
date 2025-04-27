"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/auth"; 

export default function Navbar({ username }) {
  const router = useRouter();
  const { logout, loading, error } = useAuth(); // Destructure from the useAuth hook
  const [logoutError, setLogoutError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from useAuth
      router.push("/"); // Redirect to the login page
    } catch (err) {
      console.error("Logout failed", err);
      setLogoutError(err.message || "Something went wrong while logging out");
    }
  };

  return (
    <nav className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full max-w-screen-xxl mx-auto p-2">
      <div className="text-xl font-extrabold text-black">
        Hi, {username}
      </div>
      <div className="flex items-center">
        {/* Display error message if any */}
        {logoutError && (
          <p className="text-red-600 text-sm mr-4">{logoutError}</p>
        )}
        <button
          onClick={handleLogout}
          disabled={loading} // Disable button while loading
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}
