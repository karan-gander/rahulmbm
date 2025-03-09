"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-green-400">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-widest animate-pulse">
          404
        </h1>
        <p className="text-xl mt-4">ERROR: Page Not Found</p>
        <p className="text-md mt-2 opacity-70">You seem lost in the matrix...</p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-2 text-lg font-semibold border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition duration-300"
        >
          Return Home
        </button>

        <div className="mt-8 text-sm opacity-50">
          <p>System Failure Detected... Initiating Self-Destruction...</p>
        </div>
      </div>
    </div>
  );
}
