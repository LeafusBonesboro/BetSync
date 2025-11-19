"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/components/auth/AuthContext";

export default function DiscordSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      console.log("❌ No token found in URL");
      return;
    }

    console.log("🔥 TOKEN FROM DISCORD:", token);

    // Save token as cookie
    Cookies.set("token", token, {
      expires: 7,
      path: "/",
      sameSite: "lax",
    });

    // Fetch user with token
    fetch("http://localhost:4000/auth/me", {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("🔥 RAW RESPONSE FROM BACKEND:", text);

        return text ? JSON.parse(text) : null;
      })
      .then((user) => {
        console.log("🔥 PARSED USER:", user);
        setUser(user);
        router.push("/");
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      });
  }, []);

  return <p className="text-white p-10">Signing you in…</p>;
}
