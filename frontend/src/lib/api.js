const BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
