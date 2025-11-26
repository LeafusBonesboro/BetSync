"use client";

import { useState, useEffect } from "react";

export default function LoginModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler() {
      setOpen(true);
    }
    document.addEventListener("open-login", handler);
    return () => document.removeEventListener("open-login", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1A1A20] p-6 rounded-lg w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>

        {/* Discord Login Button */}
        <button
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 rounded"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;

          }}
        >
          Continue with Discord
        </button>

        {/* Cancel */}
        <button
          className="w-full mt-3 text-gray-300 border border-gray-600 py-2 rounded"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
