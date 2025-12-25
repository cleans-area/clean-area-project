import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE,
  headers: {
    Accept: "application/json",
  },
});

// otomatis inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default api;
