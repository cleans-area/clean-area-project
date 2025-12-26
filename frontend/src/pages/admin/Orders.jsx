import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchOrders, deleteOrder } from "../../lib/orders"; 
import { Eye, AlertCircle, Plus, Trash2, MessageCircle, Filter, Search } from "lucide-react"; 

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State Filter & Search
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState(""); // State baru untuk pencarian

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

  // Logic gabungan: Filter Status + Search (Nama & Ticket)
  const filteredOrders = orders.filter((o) => {
    // 1. Filter Status
    const matchesStatus = filterStatus === "ALL" || o.order_status?.toUpperCase() === filterStatus.toUpperCase();
    
    // 2. Filter Search (Cek Ticket Code & Nama Customer)
    const matchesSearch = 
      o.ticket_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  async function handleDelete(id, ticketCode) {
    const ok = window.confirm(`Yakin hapus order ${ticketCode}?\n\nFoto-foto di order ini juga akan ikut terhapus.`);
    if (!ok) return;

    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id)); 
      alert("Order berhasil dihapus.");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal hapus order");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": case "paid": case "done":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "pending": case "process":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "cancelled": case "cancel":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-white/40 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Orders Management</h2>
          <p className="text-white/50 text-sm mt-1">Pantau dan kelola pesanan customer secara real-time.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          {/* SEARCH BAR */}
<div className="relative w-full group">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={16} />
  <input 
    type="text"
    placeholder="Cari Tiket atau Nama..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-all shadow-inner"
  />
</div>

{/* FILTER STATUS */}
<div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 w-full transition-all focus-within:border-emerald-500/50">
  <Filter size={16} className="text-white/30" />
  <select 
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer uppercase tracking-wider w-full"
  >
    <option value="ALL" className="bg-[#184832]">Semua Status</option>
    <option value="PENDING" className="bg-[#184832]">Pending</option>
    <option value="PROCESS" className="bg-[#184832]">Process</option>
    <option value="DONE" className="bg-[#184832]">Done</option>
    <option value="CANCEL" className="bg-[#184832]">Cancel</option>
  </select>
</div>

          <Link
            to="/admin/orders/create"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#184832] rounded-xl font-bold hover:bg-opacity-90 transition-all active:scale-95 shadow-lg w-full md:w-auto"
          >
            <Plus size={18} />
            Tambah Order
          </Link>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
            <div className="flex items-center gap-2 text-white/30 text-sm p-4">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Loading orders...
            </div>
        ) : errorMsg ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl font-medium">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <tr>
                    <th className="p-4 w-[50px]">No</th>
                    <th className="p-4">Ticket</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Service</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Payment</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="p-10 text-center text-white/20 italic font-medium">
                                {searchQuery 
                                  ? `Tidak ada hasil untuk "${searchQuery}"` 
                                  : `Tidak ada pesanan dengan status "${filterStatus}"`}
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((o, index) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 text-white/30 font-mono">{index + 1}</td>
                            <td className="p-4 font-mono font-bold text-white/80">{o.ticket_code}</td>
                            <td className="p-4 text-white font-medium">{o.customer_name}</td>
                            <td className="p-4">
                              <a 
                                href={`https://wa.me/${o.customer_phone?.replace(/\D/g, '')}`} 
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                <MessageCircle size={14} />
                                <span className="font-mono text-xs">{o.customer_phone || "-"}</span>
                              </a>
                            </td>
                            <td className="p-4 text-white/70">{o.service?.name || "N/A"}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(o.order_status)}`}>
                                    {o.order_status}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(o.payment_status)}`}>
                                    {o.payment_status}
                                </span>
                            </td>
                            <td className="p-4 text-white/30 text-[11px] leading-tight">
                                {new Date(o.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} <br/>
                                <span className="opacity-50">{new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => navigate(`/admin/orders/${o.id}`)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white text-white/70 hover:text-[#184832] border border-white/10 transition-all font-bold text-xs">
                                      <Eye size={14} /> Detail
                                  </button>
                                  <button onClick={() => handleDelete(o.id, o.ticket_code)} className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex items-center gap-2">
                                    <Trash2 size={14} /> Hapus
                                  </button>
                                </div>
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