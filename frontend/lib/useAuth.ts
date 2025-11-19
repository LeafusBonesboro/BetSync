"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";

export function useAuth(redirectToLogin = true) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await apiFetch("/auth/me");
        setUser(me);
      } catch {
        if (redirectToLogin) router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, redirectToLogin]);

  return { user, loading };
}
