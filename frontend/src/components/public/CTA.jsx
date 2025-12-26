import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="rounded-[36px] border border-black/10 bg-white p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">Quick Action</div>
          <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
            Mau cek status order?
          </h3>
          <p className="mt-2 text-slate-600 max-w-xl">
            Nanti kita sambungkan ke fitur Track Order (API) — untuk sekarang kita siapkan tombol & alurnya dulu.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/layanan")}
            className="rounded-2xl bg-black text-white px-6 py-3 font-black hover:opacity-90 transition"
          >
            Lihat Layanan
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl bg-amber-400 text-black px-6 py-3 font-black hover:brightness-95 transition"
          >
            Track Order
          </button>
        </div>
      </div>
    </section>
  );
}
