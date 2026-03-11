import { useState } from "react";
import api from "../api";

export default function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      onLogin(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 px-4">
      <div className="w-full max-w-md border border-neutral-200 rounded-3xl p-8 md:p-10">
        <div className="space-y-2 mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">SmartPark</div>
          <h2 className="text-3xl font-semibold">Receptionist Login</h2>
          <p className="text-sm text-neutral-500">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">Username</label>
            <input
              autoComplete="username"
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. receptionist"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            className="w-full py-3 rounded-xl border border-black bg-black text-white hover:bg-white hover:text-black transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-sm text-neutral-600">
          Need an account?{" "}
          <button
            onClick={onShowRegister}
            className="text-black font-medium hover:underline"
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
