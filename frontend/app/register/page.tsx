"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Attempt signup (Supabase handles duplicate check internally)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Friendly messages
      if (error.message.includes("already registered")) {
        setMessage("This email is already registered.");
      } else if (error.message.includes("password")) {
        setMessage("Password must meet minimum requirements.");
      } else {
        setMessage(error.message);
      }
      return;
    }

    // Success
    setMessage("Success! Check your email to confirm your account.");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-white px-6">
      <div className="w-full max-w-md bg-[#1e293b]/60 p-8 rounded-xl border border-white/10 shadow-lg">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Create your account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="text-sm">Email address</label>
            <input
              type="email"
              required
              className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-600 text-white rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-600 text-white rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {message && (
            <p className="text-yellow-300 text-center text-sm">{message}</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
