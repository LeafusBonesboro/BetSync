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

  const DISCORD_SERVER_LINK = "https://discord.gg/kDeTsP229P";

  // Redirect logged-in users
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/bets");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading session…
      </div>
    );
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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

    router.replace("/bets");
  }

  async function handleResend() {
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

    setMessage("Confirmation email sent.");
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessage("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password reset email sent.");
  }

  return (
    <div className="min-h-screen bg-[#0d0d11] flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SIDE — HERO + NEW ONBOARDING FLOW */}
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            BetSync — One place for <span className="text-amber-400">all your bets.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mt-6 leading-relaxed">
            Sportsbooks make it hard to find your wagers. BetSync fixes that by giving you a 
            clean, unified feed that automatically organizes every bet slip you share.
          </p>

          <div className="space-y-6 mt-10">

            {/* STEP 1 */}
            <div className="bg-[#121218] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl text-white font-semibold mb-3">Step 1 — Create Your Account</h2>
              <p className="text-gray-300">Sign up so BetSync can sync your bets into your personal dashboard.</p>
            </div>

            {/* STEP 2 */}
            <div className="bg-[#121218] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl text-white font-semibold mb-3">Step 2 — Join the Discord Server</h2>
              <p className="text-gray-300 mb-4">The BetSync bot lives in our Discord server.</p>
              <a
                href={DISCORD_SERVER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium"
              >
                Join Discord Server
              </a>
            </div>

            {/* STEP 3 */}
            <div className="bg-[#121218] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl text-white font-semibold mb-3">Step 3 — Share Your First Bet</h2>
              <p className="text-gray-300">
                Open a bet slip → tap <b>Share</b> → choose <b>Discord</b> → select the BetSync bot.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE — LOGIN BOX */}
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
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 bg-[#0f172a] border border-gray-700 text-white rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              {message && (
                <p className="text-yellow-300 text-center text-sm mt-2">{message}</p>
              )}
            </form>

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
