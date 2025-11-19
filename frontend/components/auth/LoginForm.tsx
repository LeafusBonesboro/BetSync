"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setUser(data.user);   // Save user
      onSuccess();          // Close modal
      // ⛔ No redirect. Stay on same page.

    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Login</h2>

      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        className="border p-2 rounded w-full"
      />

      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button className="bg-blue-600 text-white w-full p-2 rounded">
        Login
      </button>
    </form>
  );
}
