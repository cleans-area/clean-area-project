import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchOrders } from "../../lib/orders";
import { Eye, Clock, CheckCircle2, AlertCircle } from "lucide-react"; // Ikon pendukung

export default function AdminOrders() {
  const navigate = useNavigate(); // Inisialisasi navigasi
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await fetchOrders();
      setOrders(res.data ?? []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Gagal mengambil orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Helper untuk warna status (Biar UI lebih informatif)
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "pending":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-white/40 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <p className="text-white/50 text-sm mt-1">Daftar seluruh pesanan customer.</p>
      </div>

      <div className="mt-6">
        {loading && (
            <div className="flex items-center gap-2 text-white/30 text-sm p-4">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Loading orders...
            </div>
        )}

        {!loading && errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <tr>
                    <th className="p-4">Ticket</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="p-10 text-center text-white/20 italic">Belum ada pesanan masuk.</td>
                        </tr>
                    ) : (
                        orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 font-mono font-bold text-white/80">{o.ticket_code}</td>
                            <td className="p-4">
                                <p className="text-white font-medium">{o.customer_name}</p>
                                <p className="text-[10px] text-white/30 truncate max-w-[120px]">{o.customer_email || 'No Email'}</p>
                            </td>
                            <td className="p-4 text-white/70">{o.service?.name || "N/A"}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(o.order_status)}`}>
                                    {o.order_status}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(o.payment_status)}`}>
                                    {o.payment_status}
                                </span>
                            </td>
                            <td className="p-4 text-white/30 text-[11px] leading-tight">
                                {new Date(o.created_at).toLocaleDateString('id-ID', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })} <br/>
                                {new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white text-white/70 hover:text-[#184832] border border-white/10 transition-all font-bold text-xs"
                                >
                                    <Eye size={14} />
                                    Detail
                                </button>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}