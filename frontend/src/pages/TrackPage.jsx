import { useState } from "react";
import { apiGet } from "../lib/api";
import { ORDER_STATUS, PAYMENT_STATUS } from "../lib/status";

function StatusBadge({ config }) {
  if (!config) return null;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${config.color}`}>
      {config.label}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="font-medium text-slate-100">
        {value || "-"}
      </div>
    </div>
  );
}

export default function TrackPage() {
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  // Perbaikan A3: Cek apakah input kosong (setelah di-trim) untuk disable button
  const isInputEmpty = !ticket.trim();

  async function onSubmit(e) {
    e.preventDefault();
    if (isInputEmpty) return; // Proteksi tambahan

    setErr("");
    setResult(null);

    // Perbaikan A3: Trim spasi otomatis saat submit
    const code = ticket.trim();

    try {
      setLoading(true);
      const res = await apiGet(`/orders/track/${encodeURIComponent(code)}`);
      setResult(res.data);
    } catch (e) {
      setErr(e.message || "Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-white">Track Order</h1>
        <p className="text-slate-400 text-sm">
          Cek status pembersihan Anda secara real-time.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={ticket}
          // Perbaikan A3: Auto Uppercase saat mengetik
          onChange={(e) => setTicket(e.target.value.toUpperCase())}
          placeholder="Contoh: CA-XXXXXX"
          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-all"
        />
        <button
          // Perbaikan A3: Disable jika loading ATAU input kosong
          disabled={loading || isInputEmpty}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
        >
          {loading ? "..." : "Track"}
        </button>
      </form>

      {/* Perbaikan A4: State awal sebelum ada pencarian */}
      {!result && !err && !loading && (
        <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
          <p className="text-sm text-slate-400">
            Masukkan ticket code di atas untuk melihat detail status order Anda.
          </p>
        </div>
      )}

      {err && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          ⚠️ {err}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Nomor Tiket</div>
              <div className="font-mono text-2xl font-bold text-blue-400">{result.ticket_code}</div>
            </div>
            <div className="md:text-right">
              <div className="text-xs text-slate-500 uppercase tracking-widest">Layanan</div>
              <div className="text-lg font-semibold text-slate-200">{result.service?.name ?? result.service ?? "-"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info 
              label="Status Pekerjaan" 
              value={<StatusBadge config={ORDER_STATUS[result.order_status] ?? ORDER_STATUS.pending} />} 
            />
            <Info 
              label="Status Pembayaran" 
              value={<StatusBadge config={PAYMENT_STATUS[result.payment_status] ?? PAYMENT_STATUS.unpaid} />} 
            />
            <Info label="Catatan Admin" value={result.admin_note} />
            <Info label="Tanggal Dibuat" value={new Date(result.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} />
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              <span>📸</span> Dokumentasi Area
            </div>
            {result.photos?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.photos.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                  >
                    <img 
                      src={p.url} 
                      alt="dokumentasi" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">Belum ada foto.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}