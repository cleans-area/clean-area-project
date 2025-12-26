import { getUser } from "../../lib/session";
import { LayoutDashboard, Ticket, Wrench, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const user = getUser();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Dashboard</h2>
        <p className="text-white/40 text-sm mt-1 font-medium">
          Selamat datang kembali di panel admin Clean-Area, <span className="text-emerald-400">{user?.name}</span>.
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Orders" value="—" icon={Ticket} />
        <StatCard label="Pending Orders" value="—" icon={CheckCircle2} />
        <StatCard label="Total Services" value="—" icon={Wrench} />
      </div>
    </div>
  );
}

// Komponen Kecil untuk Kartu Statistik agar Kode Bersih
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] backdrop-blur-md hover:bg-white/[0.05] transition-all group shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">{label}</p>
        <div className="p-2 bg-white/5 rounded-xl text-white/20 group-hover:text-emerald-400 transition-colors">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-4xl font-mono font-bold text-white tracking-tighter">{value}</p>
    </div>
  );
}