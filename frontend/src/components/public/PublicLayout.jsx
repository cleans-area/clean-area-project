import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
      <PublicNavbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
