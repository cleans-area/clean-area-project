import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import RequireAdmin from "./components/admin/RequireAdmin";
import AdminServices from "./pages/admin/Services";
import AdminLayout from "./components/admin/AdminLayout"; // <--- Import ini
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/track" />} />

        {/* ADMIN LOGIN (Tanpa Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<RequireAdmin />}>
          {/* Bungkus semua halaman admin dengan AdminLayout */}
          <Route element={<AdminLayout />}> 
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            {/* <Route path="/admin/orders/create" element={<AdminOrderCreate />} /> */}

          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}