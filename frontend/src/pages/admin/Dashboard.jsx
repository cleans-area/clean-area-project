import { useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";
import { getUser } from "../../lib/session";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logout(); // punyamu sudah ada
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-300 text-sm">
            Logged in as: {user?.name} ({user?.role})
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p>Login berhasil 🎉</p>
    </div>
  );
}
