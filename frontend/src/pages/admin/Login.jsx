import { useState, useEffect } from "react"; // Tambah useEffect
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/auth";
import { getUser, isLoggedIn } from "../../lib/session"; // Import helper session
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tambahkan Logic Auto-Redirect jika sudah login
  useEffect(() => {
    const user = getUser();
    if (isLoggedIn() && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/admin/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 w-screen min-h-screen flex items-center justify-center bg-[#184832] text-white p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Login</h1>
          <p className="text-white/60 text-sm mt-2">Silakan masuk ke panel manajemen</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Input Email */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 ml-1">Email</label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                <Mail size={18} strokeWidth={2} />
              </div>
              <input
                type="email"
                placeholder="admin@mail.com"
                className="w-full p-3 pl-10 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-sm text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 ml-1">Password</label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                <Lock size={18} strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 pl-10 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-sm text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/20 hover:text-white/60 transition-all active:scale-90"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} /> 
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-white text-[#184832] font-bold py-3.5 rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50 mt-4"
          >
            {loading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-[#184832]/30 border-t-[#184832] rounded-full animate-spin"></div>
                 <span>Logging in...</span>
               </div>
            ) : "Login"}
          </button>
        </div>
        
        <div className="mt-10 text-center border-t border-white/5 pt-6">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">© 2025 Clean Area Project</p>
        </div>
      </form>
    </div>
  );
}