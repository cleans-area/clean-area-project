import { NavLink, useNavigate } from "react-router-dom";

const navItem = "px-4 py-2 rounded-full text-sm font-semibold hover:bg-black/5 transition";
const navActive = "bg-white shadow-sm border border-black/10";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-6xl rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md shadow-lg px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-black text-white grid place-items-center font-black">
            CA
          </div>
          <div className="leading-tight text-left">
            <div className="font-black tracking-tight">Clean-Area</div>
            <div className="text-xs text-slate-500">Cuci Sepatu Premium</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={({isActive}) => `${navItem} ${isActive ? navActive : ""}`}>Beranda</NavLink>
          <NavLink to="/tentang" className={({isActive}) => `${navItem} ${isActive ? navActive : ""}`}>Tentang</NavLink>
          <NavLink to="/layanan" className={({isActive}) => `${navItem} ${isActive ? navActive : ""}`}>Layanan</NavLink>
          <NavLink to="/lokasi" className={({isActive}) => `${navItem} ${isActive ? navActive : ""}`}>Lokasi</NavLink>
          <NavLink to="/promo" className={({isActive}) => `${navItem} ${isActive ? navActive : ""}`}>Promo</NavLink>
        </div>

        <button
          onClick={() => navigate("/layanan")}
          className="rounded-2xl bg-amber-400 px-5 py-2 text-sm font-black text-black shadow-md hover:brightness-95 transition"
        >
          Daftar Menu
        </button>
      </div>
    </div>
  );
}
