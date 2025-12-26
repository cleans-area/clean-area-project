import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Perbaikan: Tambahkan deleteOrderPhoto ke daftar import
import { 
  fetchOrderDetail, 
  updateOrderStatus, 
  updateOrderPayment, 
  updateOrderNote, 
  uploadOrderPhotos,
  deleteOrderPhoto 
} from "../../lib/orders";
// Perbaikan: Tambahkan Trash2 ke daftar import lucide-react
import { 
  ChevronLeft, User, CreditCard, Save, 
  Image as ImageIcon, MessageSquare, Upload, X, Trash2 
} from "lucide-react";

const STATUS_OPTIONS = ["PENDING", "PROCESS", "DONE", "CANCEL"];
const PAYMENT_METHODS = ["CASH", "QRIS", "TRANSFER"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [statusDraft, setStatusDraft] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [paymentDraft, setPaymentDraft] = useState({ price: 0, amount_paid: 0, payment_method: "" });
  const [savingPayment, setSavingPayment] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetchOrderDetail(id);
      const data = res.data;
      setOrder(data);
      
      setStatusDraft(data.order_status);
      setNoteDraft(data.admin_note || "");
      setPaymentDraft({
        price: data.price || 0,
        amount_paid: data.amount_paid || 0,
        payment_method: data.payment_method || "CASH",
      });
    } catch (e) {
      setErrorMsg("Gagal mengambil detail order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // Handler Hapus Foto (Step 5)
  async function handleDeletePhoto(photoId) {
    if (!confirm("Hapus foto ini secara permanen?")) return;
    
    try {
      await deleteOrderPhoto(photoId); //
      await load(); //
      alert("Foto berhasil dihapus");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal menghapus foto");
    }
  }

  async function handleUploadPhotos() {
    try {
      setUploading(true);
      await uploadOrderPhotos(order.id, selectedFiles);
      setSelectedFiles([]); 
      await load(); 
      alert("Foto berhasil diunggah!");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal upload foto");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveStatus() {
    try {
      setSavingStatus(true);
      await updateOrderStatus(order.id, statusDraft);
      await load();
      alert("Status order berhasil diperbarui!");
    } catch (e) { alert(e.response?.data?.message || "Gagal update status"); } finally { setSavingStatus(false); }
  }

  async function handleSavePayment() {
    try {
      setSavingPayment(true);
      await updateOrderPayment(order.id, {
        price: Number(paymentDraft.price),
        amount_paid: Number(paymentDraft.amount_paid),
        payment_method: paymentDraft.payment_method,
      });
      await load();
      alert("Data pembayaran berhasil diperbarui!");
    } catch (e) { alert(e.response?.data?.message || "Gagal update pembayaran"); } finally { setSavingPayment(false); }
  }

  async function handleSaveNote() {
    try {
      setSavingNote(true);
      await updateOrderNote(order.id, { admin_note: noteDraft });
      await load();
      alert("Catatan admin berhasil diperbarui!");
    } catch (e) { alert(e.response?.data?.message || "Gagal update catatan"); } finally { setSavingNote(false); }
  }

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all text-white/70">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Order — <span className="text-white/60 font-mono">{order.ticket_code}</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Customer Info */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/50 px-2">
              <User size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Customer Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Nama Customer" value={order.customer_name} />
              <Info label="No. HP" value={order.customer_phone} />
              <div className="md:col-span-2">
                <Info label="Alamat Lengkap" value={order.customer_address} />
              </div>
            </div>
          </section>

          {/* 2. Order & Payment Info */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-white/50">
                <CreditCard size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Order & Payment</h3>
              </div>
              <button 
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="text-[10px] font-bold uppercase tracking-widest bg-white text-[#184832] px-4 py-2 rounded-xl hover:bg-white/90 disabled:opacity-30 transition-all shadow-lg"
              >
                {savingPayment ? "Saving..." : "Simpan Pembayaran"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 mb-2 uppercase font-black tracking-widest">Order Status</p>
                <div className="flex gap-2">
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#184832] uppercase">{s}</option>
                    ))}
                  </select>
                  <button onClick={handleSaveStatus} disabled={savingStatus || statusDraft === order.order_status} className="text-emerald-400 disabled:opacity-0 transition-opacity">
                    <Save size={18} />
                  </button>
                </div>
              </div>

              <Info label="Payment Status" value={order.payment_status} isStatus statusType={order.payment_status} />

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 mb-2 uppercase font-black tracking-widest">Method</p>
                <select
                  value={paymentDraft.payment_method}
                  onChange={(e) => setPaymentDraft({ ...paymentDraft, payment_method: e.target.value })}
                  className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m} className="bg-[#184832] uppercase">{m}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 mb-1 uppercase font-black tracking-widest">Total Harga</p>
                <input
                  type="number"
                  value={paymentDraft.price}
                  onChange={(e) => setPaymentDraft({ ...paymentDraft, price: e.target.value })}
                  className="w-full bg-transparent text-lg font-mono font-bold text-white outline-none"
                />
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 mb-1 uppercase font-black tracking-widest">Sudah Dibayar</p>
                <input
                  type="number"
                  value={paymentDraft.amount_paid}
                  onChange={(e) => setPaymentDraft({ ...paymentDraft, amount_paid: e.target.value })}
                  className="w-full bg-transparent text-lg font-mono font-bold text-white outline-none"
                />
              </div>

              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl flex flex-col justify-center shadow-inner">
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Sisa Tagihan</p>
                <p className={`text-lg font-mono font-bold ${paymentDraft.price - paymentDraft.amount_paid > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  Rp {(paymentDraft.price - paymentDraft.amount_paid).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Admin Note */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-white/50">
                <MessageSquare size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Admin Note</h3>
              </div>
              <button 
                onClick={handleSaveNote}
                disabled={savingNote || noteDraft === (order.admin_note || "")}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                {savingNote ? "Saving..." : "Simpan Note"}
              </button>
            </div>
            
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={4}
              placeholder="Tulis catatan admin di sini..."
              className="w-full rounded-3xl bg-white/5 border border-white/10 p-6 text-white text-sm outline-none focus:border-white/30 transition-all italic leading-relaxed shadow-lg resize-none"
            />
          </section>
        </div>

        {/* Kolom Kanan: Photos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 text-white/50 px-2">
            <ImageIcon size={18} />
            <h3 className="font-bold text-sm uppercase tracking-widest">Photos</h3>
          </div>

          {/* Upload Box */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-lg space-y-4">
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 ml-1">Upload Baru</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="block w-full text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
            />

            {/* Preview Section - Foto yang baru dipilih */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="rounded-xl h-full w-full object-cover border border-white/10 shadow-md"
                    />
                    <button 
                      onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleUploadPhotos}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 shadow-md"
            >
              {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Foto`}
            </button>
          </div>

          {/* Existing Photos List - Update dengan tombol Hapus (Step 5) */}
          <div className="grid grid-cols-2 gap-4">
            {order.photos?.map((p) => (
              <div key={p.id} className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl group relative bg-black/20">
                <img 
                   src={p.url} 
                   alt="Order Detail" 
                   className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                   onError={(e) => {
                     e.target.src = "https://placehold.co/400x400/184832/white?text=Image+Not+Found";
                   }}
                />
                
                {/* Overlay: Muncul saat di-hover (Step 5) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <a 
                    href={p.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-3/4 py-1 text-center font-bold text-[10px] uppercase text-white bg-white/20 hover:bg-white/40 rounded backdrop-blur-md transition-all"
                  >
                    View Full
                  </a>
                  
                  {/* Tombol Hapus (Step 5) */}
                  <button
                    onClick={() => handleDeletePhoto(p.id)}
                    className="w-3/4 py-1 flex items-center justify-center gap-1 font-bold text-[10px] uppercase text-white bg-red-600/60 hover:bg-red-600 rounded backdrop-blur-md transition-all"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {order.photos?.length === 0 && selectedFiles.length === 0 && (
            <div className="text-center py-10 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Belum ada foto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, isStatus = false, statusType = "" }) {
  const getStatusColor = (type) => {
    const s = type?.toLowerCase();
    if (s === "completed" || s === "paid" || s === "done") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (s === "pending" || s === "process") return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (s === "cancel") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-white/60 bg-white/5 border-white/10";
  };
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-lg transition-all hover:bg-white/10">
      <p className="text-[10px] text-white/30 mb-1 uppercase font-black tracking-widest">{label}</p>
      {isStatus ? (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(statusType)}`}>{value || "-"}</span>
      ) : ( <p className="font-medium text-white">{value || "-"}</p> )}
    </div>
  );
}