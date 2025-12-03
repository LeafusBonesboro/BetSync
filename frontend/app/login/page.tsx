"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/bets"); // redirect after login
  }

  async function handleResend() {
    setMessage("");

    if (!email) {
      setMessage("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Confirmation email sent again.");
  }

  async function handleOAuth(provider: "google" | "discord") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-white px-6">
      <div className="w-full max-w-md bg-[#1e293b]/60 p-8 rounded-xl border border-white/10 shadow-lg">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
            type="button"
            onClick={handleResend}
            className="text-blue-400 text-sm hover:underline"
          >
            Resend confirmation email
          </button>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-md font-medium transition"
          >
            Log In
          </button>

          {message && (
            <p className="text-yellow-300 text-center text-sm">{message}</p>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* OAuth buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-md"
          >
            <img src="/google.svg" className="w-5 h-5" />
            Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("discord")}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-md"
          >
            <img src="/discord.svg" className="w-5 h-5" />
            Discord
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-300">
          Not a member?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
