import api from "./api";

export async function login(payload) {
  const res = await api.post("/login", payload);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
