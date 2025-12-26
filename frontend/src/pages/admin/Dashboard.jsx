import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // Tambahkan Link untuk navigasi
import { getUser } from "../../lib/session";
import { fetchAdminOrders, fetchAdminServices } from "../../lib/dashboard";
import { Ticket, Wrench, CheckCircle2, RefreshCw, PlusCircle, LayoutGrid } from "lucide-react";

export default function Dashboard() {
  const user = getUser();

  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [ordersRes, servicesRes] = await Promise.all([
        fetchAdminOrders(),
        fetchAdminServices(),
      ]);

      setOrders(ordersRes.data?.data || []);
      setServices(servicesRes.data?.data || []);
    } catch (error) {
      console.error("Gagal memuat data dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) =>
      String(o.order_status).toLowerCase() === "pending"
    ).length;
    const totalServices = services.length;

    return { totalOrders, pendingOrders, totalServices };
  }, [orders, services]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 lg:pb-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Dashboard</h2>
          <p className="text-white/40 text-sm mt-1 font-medium">
            Selamat datang kembali di panel admin Clean-Area, <span className="text-emerald-400">{user?.name}</span>.
          </p>
        </div>
        
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 self-start px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all text-xs font-bold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Orders" 
          value={loading ? "..." : stats.totalOrders} 
          icon={Ticket} 
        />
        <StatCard 
          label="Pending Orders" 
          value={loading ? "..." : stats.pendingOrders} 
          icon={CheckCircle2} 
          isWarning={stats.pendingOrders > 0 && !loading}
        />
        <StatCard 
          label="Total Services" 
          value={loading ? "..." : stats.totalServices} 
          icon={Wrench} 
        />
      </div>

      {/* SECTION QUICK ACTIONS - PENAMBAHAN BARU */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-white/30">
          <LayoutGrid size={16} />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-black">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickActionBtn 
            to="/admin/orders/create"
            label="Tambah Order Baru"
            desc="Input pesanan customer manual"
            icon={PlusCircle}
            variant="emerald"
          />
          <QuickActionBtn 
            to="/admin/services"
            label="Kelola Layanan"
            desc="Update harga atau jasa baru"
            icon={Wrench}
            variant="white"
          />
        </div>
      </section>
    </div>
  );
}

// Komponen Tombol Quick Action agar UI Konsisten
function QuickActionBtn({ to, label, desc, icon: Icon, variant }) {
  const isEmerald = variant === "emerald";
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all active:scale-95 group shadow-lg ${
        isEmerald 
        ? "bg-emerald-500 border-emerald-400 text-[#184832] hover:bg-emerald-400" 
        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
      }`}
    >
      <div className={`p-3 rounded-2xl ${isEmerald ? "bg-[#184832]/10" : "bg-white/5 group-hover:text-emerald-400"}`}>
        <Icon size={24} />
      </div>
      <div className="text-left">
        <p className="font-bold text-sm leading-none mb-1">{label}</p>
        <p className={`text-[10px] font-medium uppercase tracking-wider ${isEmerald ? "text-[#184832]/60" : "text-white/30"}`}>
          {desc}
        </p>
      </div>
    </Link>
  );
}

function StatCard({ label, value, icon: Icon, isWarning }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] backdrop-blur-md hover:bg-white/[0.05] transition-all group shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">{label}</p>
        <div className={`p-2 rounded-xl transition-colors ${
          isWarning ? "bg-orange-500/10 text-orange-400" : "bg-white/5 text-white/20 group-hover:text-emerald-400"
        }`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-mono font-bold text-white tracking-tighter">{value}</p>
        {isWarning && (
          <span className="text-[10px] font-bold text-orange-400 animate-pulse">ACTION</span>
        )}
      </div>
    </div>
  );
}