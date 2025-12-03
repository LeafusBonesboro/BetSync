"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    // Check if user already exists by trying login with wrong password
    const { error: existsError } = await supabase.auth.signInWithPassword({
      email,
      password: "wrongpassword",
    });

    if (existsError && existsError.message === "Invalid login credentials") {
      setMessage("This email is already registered.");
      return;
    }

    // Continue with signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
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
              className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-md font-medium transition"
          >
            Register
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
