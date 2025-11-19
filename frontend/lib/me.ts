import { apiFetch } from "./api";

export async function fetchMe() {
  const res = await apiFetch('/auth/me');

  if (!res.ok) return null;

  return res.json();
}
