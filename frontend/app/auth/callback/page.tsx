"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // After Supabase OAuth, user is already logged in
    router.replace("/bets");
  }, []);

  return (
    <div className="text-white p-10">
      Logging you in...
    </div>
  );
}
