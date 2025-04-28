"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/auth"; 
import { useAppSelector } from '@/store/hooks';

export default function Navbar() {
  const router = useRouter();
  const { logout, loading, error } = useAuth(); 
  const [logoutError, setLogoutError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const email = useAppSelector((state) => state.user.email);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); 
      router.push("/"); 
    } catch (err) {
      console.error("Logout failed", err);
      setLogoutError(err.message || "Something went wrong while logging out");
    }
  };

  // Prevent hydration errors by only showing content after mounting
  if (!mounted) {
    return (
      <nav className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full max-w-screen-xxl mx-auto p-2">
        <div className="text-xl font-extrabold text-black">
          Welcome
        </div>
        <div className="flex items-center">
          <button
            disabled
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg opacity-50 cursor-not-allowed"
          >
            Loading...
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full max-w-screen-xxl mx-auto p-2">
      <div className="text-xl font-extrabold text-black">
        {email ? `Welcome, ${email}` : 'Welcome, Guest'}
      </div>
      <div className="flex items-center">
        {logoutError && (
          <p className="text-red-600 text-sm mr-4">{logoutError}</p>
        )}
        <button
          onClick={handleLogout}
          disabled={loading} 
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
