// src/lib/dashboard.js
import api from "./api";

export async function fetchAdminOrders() {
  return api.get("/admin/orders");
}

export async function fetchAdminServices() {
  return api.get("/admin/services");
}
