import api from "./api";

/**
 * Mengambil daftar seluruh pesanan (Orders)
 */
export async function fetchOrders() {
  const res = await api.get("/admin/orders");
  return res.data; // Mengembalikan { data: [...] }
}

/**
 * Mengambil detail satu pesanan berdasarkan ID
 */
export async function fetchOrderDetail(id) {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data; // Mengembalikan data detail order
}

/**
 * Memperbarui status pesanan (pending, process, done, cancel)
 * Sesuai Step O5.1
 */
export async function updateOrderStatus(id, status) {
  const res = await api.patch(`/admin/orders/${id}/status`, {
    order_status: status,
  });
  return res.data; // Mengembalikan { message, data }
}

/**
 * Memperbarui detail pembayaran (price, amount_paid, payment_method)
 * Sesuai Step O5.2
 */
export async function updateOrderPayment(orderId, payload) {
  const res = await api.patch(`/admin/orders/${orderId}/payment`, payload);
  return res.data;
}

export async function updateOrderNote(orderId, payload) {
  const res = await api.patch(`/admin/orders/${orderId}/note`, payload);
  return res.data;
}

export async function uploadOrderPhotos(orderId, files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("photos[]", file);
  });

  const res = await api.post(
    `/admin/orders/${orderId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export function deleteOrderPhoto(photoId) {
  return api.delete(`/admin/order-photos/${photoId}`);
}

