import { useState } from "react";
import api from "../api";

export default function Register({ onRegister, onShowLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", { username, password });
      onRegister(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-md bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Create Account</h2>
        <p className="text-slate-500 mb-6">Register a receptionist account.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Confirm Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            className="w-full py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <button
            onClick={onShowLogin}
            className="text-slate-900 font-medium hover:underline"
            type="button"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
