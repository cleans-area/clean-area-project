import { useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";
import { getUser } from "../../lib/session";
import { LogOut, User, Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    if (window.confirm("Yakin ingin keluar?")) {
      logout();
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-white/[0.02] backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger: Muncul di mobile, memicu toggleSidebar dari Layout */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          className="lg:hidden p-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all border border-white/10"
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Workspace</span>
          <h2 className="text-sm font-bold text-white/80 hidden sm:block tracking-tight">Dashboard Overview</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-3 md:pr-6 md:border-r border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white tracking-tight">{user?.name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-tighter font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <User size={20} />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2.5 md:px-4 md:py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95"
        >
          <LogOut size={18} />
          <span className="hidden md:block text-xs font-black uppercase tracking-widest">Keluar</span>
        </button>
      </div>
    </header>
  );
}