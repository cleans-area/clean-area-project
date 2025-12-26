import { NavLink } from "react-router-dom";
import { LayoutDashboard, Ticket, Wrench, X } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: Ticket },
  { name: "Services", path: "/admin/services", icon: Wrench },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
   <>
      {/* Overlay hitam transparan saat menu terbuka di HP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70]
        w-64 bg-[#0a2116] border-r border-white/5 p-6 flex flex-col h-full shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Header Sidebar & Close Button for Mobile */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              CLEAN<span className="text-emerald-400">AREA</span>
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Admin Panel</p>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }} // Tutup otomatis di mobile setelah klik
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-white text-[#184832] font-bold shadow-lg shadow-black/20"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}