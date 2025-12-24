import { useState } from "react";
import { apiGet } from "../lib/api";

export default function TrackPage() {
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setResult(null);

    const code = ticket.trim();
    if (!code) return setErr("Ticket code wajib diisi.");

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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Track Order</h1>
        <p className="text-slate-300 text-sm">
          Masukkan ticket code (contoh: <span className="font-mono">CA-XXXXXX</span>)
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder="CA-XXXXXX"
          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600 font-mono"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-white text-slate-950 px-4 py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Loading..." : "Track"}
        </button>
      </form>

      {err && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-300">Ticket</div>
              <div className="font-mono text-lg">{result.ticket_code}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-300">Service</div>
              <div className="font-medium">{result.service ?? "-"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Order Status" value={result.order_status} />
            <Info label="Payment Status" value={result.payment_status} />
            <Info label="Admin Note" value={result.admin_note ?? "-"} />
            <Info label="Created At" value={new Date(result.created_at).toLocaleString()} />
          </div>

          <div>
            <div className="text-sm text-slate-300 mb-2">Photos</div>
            {result.photos?.length ? (
              <div className="grid grid-cols-2 gap-2">
                {result.photos.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border border-slate-800"
                  >
                    <img src={p.url} alt={`photo-${p.id}`} className="h-40 w-full object-cover" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400">Belum ada foto.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
      <div className="text-slate-400">{label}</div>
      <div className="mt-1 font-medium">{String(value ?? "-")}</div>
    </div>
  );
}
