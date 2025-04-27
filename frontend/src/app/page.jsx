"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Offcanvas from "../components/Offcanvas";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "login" || mode === "signup") {
      setIsOffcanvasOpen(true);
      setIsSignupMode(mode === "signup");
    }
  }, [searchParams]);

  const openLogin = () => {
    router.push("?mode=login", { shallow: true });
    setIsSignupMode(false);
  };

  const openSignup = () => {
    router.push("?mode=signup", { shallow: true });
    setIsSignupMode(true);
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
    router.push("/", { shallow: true });
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-8 bg-black text-white">
      <h1 className="text-6xl font-extrabold text-center mb-8 w-full">
        Welcome to Resume Sorting AI
      </h1>
      <button
        onClick={openLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white text-2xl px-8 py-4 rounded-full transition cursor-pointer"
      >
        Get Started
      </button>

      <Offcanvas isOpen={isOffcanvasOpen} onClose={closeOffcanvas}>
        {isSignupMode ? (
          <SignupForm switchToLogin={openLogin} />
        ) : (
          <LoginForm switchToSignup={openSignup} />
        )}
      </Offcanvas>
    </main>
  );
}
