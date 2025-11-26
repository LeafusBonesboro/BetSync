"use client";

import { createClient } from "@/utils/supabase/client";


export async function apiFetch(path: string, options: RequestInit = {}) {
  const supabase = createClient();

  // Get the current auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
}
