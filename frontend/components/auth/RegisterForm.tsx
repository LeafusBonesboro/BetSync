"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "./AuthContext";

export default function RegisterForm() {
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setUser(user);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 w-full">
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button className="bg-blue-600 text-white w-full p-2 rounded">
        Register
      </button>
    </form>
  );
}
