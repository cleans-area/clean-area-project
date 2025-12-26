import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    // h-screen dan w-screen memastikan layout mengisi seluruh layar browser
    <div className="flex h-screen w-screen bg-[#184832] text-white overflow-hidden">
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Area Utama: flex-col agar Header di atas dan Content di bawah */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        {/* Konten Utama dengan scrolling mandiri */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}