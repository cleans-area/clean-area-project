import { useEffect, useState } from "react";
import { fetchServices, createService, updateService, deleteService } from "../../lib/services";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    is_active: true,
  });

  async function load() {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await fetchServices();
      setServices(data?.data ?? []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Gagal mengambil services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: form.price === "" ? 0 : Number(form.price),
        is_active: !!form.is_active,
      };

      if (editing) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }

      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Gagal menyimpan service");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service) {
    if (!window.confirm(`Hapus service "${service.name}"?`)) return;
    try {
      setLoading(true);
      await deleteService(service.id);
      await load();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Gagal menghapus service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Diperbaiki agar responsif (stacking di mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Services</h2>
          <p className="text-white/50 text-sm mt-1 font-medium">Kelola daftar layanan pembersihan.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", description: "", price: "", is_active: true });
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#184832] rounded-xl font-bold hover:bg-opacity-90 transition-all active:scale-95 shadow-lg w-full sm:w-auto"
        >
          <Plus size={18} />
          Tambah Service
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Tabel - Menambahkan overflow-x-auto agar bisa di-scroll di HP */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-white/5 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
              <tr>
                <th className="p-4 w-[70px]">ID</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 w-[120px]">Harga</th>
                <th className="p-4 w-[120px]">Status</th>
                <th className="p-4 w-[150px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-white/30">Loading services...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-white/30 font-medium italic text-xs">Belum ada service tersedia.</td></tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/50 font-mono">{s.id}</td>
                    <td className="p-4 text-white font-bold">{s.name}</td>
                    <td className="p-4 text-white/60 italic truncate max-w-[200px]">
                      {s.description || "—"}
                    </td>
                    <td className="p-4 text-white font-mono">
                      Rp {typeof s.price === "number" ? s.price.toLocaleString("id-ID") : s.price}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block w-20 text-center py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        s.is_active 
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                        : "text-white/30 bg-white/5 border border-white/10"
                      }`}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(s);
                            setForm({
                              name: s.name ?? "",
                              description: s.description ?? "",
                              price: s.price ?? "",
                              is_active: !!s.is_active,
                            });
                            setOpen(true);
                          }}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white text-white/70 hover:text-[#184832] transition-all border border-white/10 shadow-sm"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all border border-red-500/20 shadow-sm"
                        >
                          <Trash2 size={16} />
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

      {/* Modal UI - Penyesuaian agar lebih nyaman di mobile */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a2116]/90 backdrop-blur-md" onClick={() => !saving && setOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-[2.5rem] border border-white/20 bg-[#184832] p-6 sm:p-10 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white tracking-tight">{editing ? "Edit Service" : "Tambah Service"}</h3>
              <button
                type="button"
                onClick={() => !saving && setOpen(false)}
                className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Nama Layanan</label>
                <input
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Deep Clean"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Deskripsi</label>
                <textarea
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all min-h-[100px] shadow-inner"
                  rows={3}
                  placeholder="Jelaskan detail layanan..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Harga (Rp)</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all font-mono shadow-inner"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Status</label>
                  <select
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                    value={form.is_active ? "1" : "0"}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "1" }))}
                  >
                    <option value="1" className="bg-[#184832]">Active</option>
                    <option value="0" className="bg-[#184832]">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all order-2 sm:order-1"
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] px-4 py-4 rounded-2xl bg-white text-[#184832] font-black hover:bg-opacity-90 transition-all shadow-xl shadow-black/20 order-1 sm:order-2"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#184832]/20 border-t-[#184832] rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (editing ? "Simpan Perubahan" : "Simpan Service")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}