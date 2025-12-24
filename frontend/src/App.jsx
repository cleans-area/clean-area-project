import { Routes, Route, Navigate, Link } from "react-router-dom";
import TrackPage from "./pages/TrackPage";
import './App.css'


export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">Clean-Area</Link>
          <nav className="text-sm text-slate-300">
            <Link className="hover:text-white" to="/track">Track</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/track" replace />} />
          <Route path="/track" element={<TrackPage />} />
        </Routes>
      </main>
    </div>
  );
}
