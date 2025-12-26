import api from "./api";

export async function fetchServices() {
  const res = await api.get("/admin/services");
  return res.data; // biasanya { data: [...] }
}

export async function createService(payload) {
  const res = await api.post("/admin/services", payload);
  return res.data;
}

export async function updateService(id, payload) {
  const res = await api.put(`/admin/services/${id}`, payload);
  return res.data;
}

export async function deleteService(id) {
  const res = await api.delete(`/admin/services/${id}`);
  return res.data;
}
