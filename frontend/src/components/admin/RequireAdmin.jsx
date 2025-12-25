import { Navigate, Outlet } from "react-router-dom";
import { getUser, isLoggedIn } from "../../lib/session";

export default function RequireAdmin() {
  const user = getUser();

  // belum login
  if (!isLoggedIn()) return <Navigate to="/admin/login" replace />;

  // sudah login tapi bukan admin (jaga-jaga)
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
