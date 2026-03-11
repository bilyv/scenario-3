import { useEffect, useState } from "react";
import api from "./api";
import Login from "./pages/Login";
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">CWSMS</h1>
              <p className="text-slate-500">Car Washing Sales Management System</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Logged in as {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </header>

          <nav className="flex flex-wrap gap-2 bg-white rounded-xl shadow-sm border border-slate-100 p-2">
            {pages.map((p) => (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active === p.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>

          <main className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
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
