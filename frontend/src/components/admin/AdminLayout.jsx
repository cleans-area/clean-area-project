import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  // State utama untuk mengontrol visibilitas menu di mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fungsi toggle untuk dikirim ke Header dan Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-[#184832] text-white overflow-hidden">
      {/* Kirim state dan fungsi toggle ke Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Kirim fungsi toggle ke Header agar tombol hamburger berfungsi */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}