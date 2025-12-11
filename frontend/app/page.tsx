"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if logged in → onboarding
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/onboarding");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading session…
      </div>
    );
  }

  // LOGIN FUNCTIONS
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setMessage(error.message);

    router.replace("/onboarding");
  }

  async function handleDiscordLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
  }

  async function handleResend() {
    if (!email) return setMessage("Enter your email first.");
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) return setMessage(error.message);
    setMessage("Confirmation email sent.");
  }

  async function handleForgotPassword() {
    if (!email) return setMessage("Enter your email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return setMessage(error.message);
    setMessage("Password reset email sent.");
  }

  return (
    <div className="min-h-screen bg-[#0d0d11] flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ---------------- LEFT SIDE — OLD LANDING PAGE ---------------- */}
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            BetSync — One place for <span className="text-amber-400">all your bets.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mt-6 leading-relaxed">
            Sportsbooks make it hard to find your wagers. BetSync fixes that with a
            clean, unified feed that automatically organizes every bet slip you share.
          </p>

          {/* Problem box */}
          <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-10">
            <h2 className="text-xl text-white font-semibold mb-3">The Problem</h2>
            <ul className="text-gray-400 space-y-2">
              <li>• You get logged out constantly</li>
              <li>• You get spammed with promos</li>
              <li>• You juggle 6 different sportsbook apps</li>
              <li>• Your bet history is buried</li>
              <li>• Checking results requires switching apps</li>
            </ul>
          </div>

          {/* Solution box */}
          <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-6">
            <h2 className="text-xl text-white font-semibold mb-3">The Solution</h2>
            <p className="text-gray-300">
              Just share your slip to Discord. BetSync automatically detects it and
              syncs it into your personal bet feed.
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE — LOGIN BOX ---------------- */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-[#121218] border border-gray-800 w-full max-w-md p-8 rounded-xl shadow-lg">

            <h2 className="text-2xl font-semibold text-center text-white mb-6">
              Sign in to your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="text-sm text-gray-300">Email address</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-700 text-white rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-700 text-white rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between text-sm">
                <button type="button" onClick={handleResend} className="text-blue-400 hover:underline">
                  Resend confirmation
                </button>
                <button type="button" onClick={handleForgotPassword} className="text-blue-400 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-md font-medium transition"
              >
                Log In
              </button>

              {message && <p className="text-yellow-300 text-center text-sm">{message}</p>}
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-400 text-sm">Or continue with</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <button
              type="button"
              onClick={handleDiscordLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-md text-white"
            >
              <img src="/discord.svg" className="w-5 h-5" />
              Discord
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              Not a member?{" "}
              <a href="/register" className="text-blue-400 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
