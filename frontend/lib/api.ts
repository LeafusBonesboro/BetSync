export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}

export function fetchMe() {
  return apiFetch("/auth/me");
}
