"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-8 bg-black text-white">
      <h1 className="text-6xl font-extrabold text-center mb-8 w-full">
        Welcome to Resume Sorting AI
      </h1>
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-2xl px-8 py-4 rounded-full transition cursor-pointer"
      >
        Go to Dashboard
      </button>
    </main>
  );
}
