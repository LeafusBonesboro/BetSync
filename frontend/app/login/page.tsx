"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // REGISTER STATE
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMessage, setRegMessage] = useState("");

  // LOGIN HANDLER
  async function handleLogin() {
    setLoginMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginMessage(error.message);
      return;
    }

    router.push("/");
  }

  // REGISTER HANDLER
  async function handleRegister() {
    setRegMessage("");

    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
    });

    if (error) {
      setRegMessage(error.message);
      return;
    }

    setRegMessage("Check your email to confirm your account.");
  }

  // RESEND CONFIRMATION EMAIL
  async function handleResend() {
    setLoginMessage("");

    if (!loginEmail) {
      setLoginMessage("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: loginEmail,
    });

    if (error) {
      setLoginMessage(error.message);
      return;
    }

    setLoginMessage("Confirmation email sent again. Check your inbox.");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login Page</h1>

      {/* LOGIN */}
      <section style={{ marginBottom: 40 }}>
        

        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <br />

        <button type="button" onClick={handleLogin}>
          Log In
        </button>

        <br /><br />

        {/* RESEND BUTTON */}
        <button type="button" onClick={handleResend}>
          Resend Confirmation Email
        </button>

        {/* LOGIN MESSAGE */}
        {loginMessage && (
          <p style={{ marginTop: 10, color: "yellow" }}>{loginMessage}</p>
        )}
      </section>

      {/* REGISTER */}
      <section>
        <h2>Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
        />
        <br />

        <button type="button" onClick={handleRegister}>
          Register
        </button>

        {/* REGISTER MESSAGE */}
        {regMessage && (
          <p style={{ marginTop: 10, color: "yellow" }}>{regMessage}</p>
        )}
      </section>
    </div>
  );
}
