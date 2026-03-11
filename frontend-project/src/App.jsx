import { useEffect, useState } from "react";
import api from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarPage from "./pages/CarPage";
import PackagePage from "./pages/PackagePage";
import ServicePage from "./pages/ServicePage";
import PaymentPage from "./pages/PaymentPage";
import ReportsPage from "./pages/ReportsPage";

const pages = [
  { key: "car", label: "Car" },
  { key: "packages", label: "Packages" },
  { key: "service", label: "ServicePackage" },
  { key: "payment", label: "Payment" },
  { key: "reports", label: "Reports" },
];

export default function App() {
  const [active, setActive] = useState("car");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState("login");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setAuthView("login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>
    );
  }

  if (!user) {
    return authView === "register" ? (
      <Register onRegister={setUser} onShowLogin={() => setAuthView("login")} />
    ) : (
      <Login onLogin={setUser} onShowRegister={() => setAuthView("register")} />
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                SmartPark
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold">CWSMS Dashboard</h1>
              <p className="text-sm text-neutral-500">
                Car Washing Sales Management System
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500">{user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm border border-black text-black hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </header>

          <nav className="flex flex-wrap gap-5 border-b border-neutral-200 pb-2">
            {pages.map((p) => (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className={`text-sm uppercase tracking-widest pb-2 border-b-2 transition ${
                  active === p.key
                    ? "border-black text-black"
                    : "border-transparent text-neutral-500 hover:text-black"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>

          <main className="border border-neutral-200 rounded-2xl p-5 md:p-8">
            {active === "car" && <CarPage />}
            {active === "packages" && <PackagePage />}
            {active === "service" && <ServicePage />}
            {active === "payment" && <PaymentPage />}
            {active === "reports" && <ReportsPage />}
          </main>
        </div>
      </div>
    </div>
  );
}
