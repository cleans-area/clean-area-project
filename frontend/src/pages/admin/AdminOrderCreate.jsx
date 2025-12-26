import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../../lib/services";
import api from "../../lib/api"; // Pastikan import axios instance Anda
import { ChevronLeft, Save, User, CreditCard, MapPin, MessageSquare } from "lucide-react";

export default function AdminOrderCreate() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // STEP 2: State form utama
  const [form, setForm] = useState({
    service_id: "",
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    price: "",
    amount_paid: 0,
    payment_mekthod: "CASH",
    admin_note: "",
  });

  // STEP 1: Fetch services saat page load
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetchServices();
        setServices(res.data || []);
      } catch (e) {
        alert("Gagal mengambil data service");
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  // STEP 2: Handler service change untuk AUTO SET HARGA
  function handleServiceChange(e) {
    const serviceId = e.target.value;
    const service = services.find((s) => s.id == serviceId);

    setForm((prev) => ({
      ...prev,
      service_id: serviceId,
      // Harga otomatis terisi namun tetap bisa diedit manual nanti
      price: service ? service.price : "",
    }));
  }

  // STEP 4: Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const payload = {
        ...form,
        price: Number(form.price),
        amount_paid: Number(form.amount_paid || 0),
      };

      const res = await api.post("/admin/orders", payload);

      alert("Order berhasil dibuat");
      // Redirect ke Detail Order setelah sukses
      navigate(`/admin/orders/${res.data.data.id}`);
    } catch (e) {
      alert(e.response?.data?.message || "Gagal membuat order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header navigasi balik */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tambah Order Baru</h2>
          <p className="text-white/40 text-sm">Input pesanan manual ke sistem.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. SECTION CUSTOMER INFO */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-emerald-400/70 uppercase tracking-[0.2em] font-black text-[10px]">
            <User size={14} />
            <span>Customer Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Nama Customer</label>
              <input
                required
                placeholder="Contoh: Budi Santoso"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">No HP / WhatsApp</label>
              <input
                required
                placeholder="0812..."
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                <div className="flex items-center gap-1"><MapPin size={10}/> Alamat Lengkap</div>
              </label>
              <textarea
                required
                placeholder="Alamat penjemputan atau pengerjaan..."
                value={form.customer_address}
                onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all min-h-[100px] shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* 2. SECTION SERVICE & PAYMENT INFO */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-emerald-400/70 uppercase tracking-[0.2em] font-black text-[10px]">
            <CreditCard size={14} />
            <span>Service & Payment Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dropdown Service */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Pilih Layanan</label>
              <select
                required
                value={form.service_id}
                onChange={handleServiceChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-[#184832]">--- Pilih Service ---</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#184832]">
                    {s.name} — Rp {s.price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Harga (Editable) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Harga Kesepakatan (Rp)</label>
              <input
                required
                type="number"
                placeholder="150000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
              />
            </div>

            {/* Input Dibayar & Metode */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Jumlah Dibayar (DP/Lunas)</label>
              <input
                type="number"
                placeholder="0"
                value={form.amount_paid}
                onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Metode Pembayaran</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              >
                <option value="CASH" className="bg-[#184832]">CASH</option>
                <option value="QRIS" className="bg-[#184832]">QRIS</option>
                <option value="TRANSFER" className="bg-[#184832]">TRANSFER</option>
              </select>
            </div>

            {/* Admin Note */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                <div className="flex items-center gap-1"><MessageSquare size={10}/> Admin Note (Internal)</div>
              </label>
              <textarea
                placeholder="Catatan khusus untuk pengerjaan ini..."
                value={form.admin_note}
                onChange={(e) => setForm({ ...form, admin_note: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all min-h-[80px] shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-2xl bg-white/5 text-white/50 font-bold hover:bg-white/10 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-[#184832] font-black hover:bg-opacity-90 transition-all shadow-xl shadow-black/20 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-[#184832]/20 border-t-[#184832] rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                <span>BUAT PESANAN</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}