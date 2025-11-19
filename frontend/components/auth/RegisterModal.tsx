"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form), // ✅ send correct data
      });

      router.push("/dashboard"); // redirect after success
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Create Account</h1>

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
