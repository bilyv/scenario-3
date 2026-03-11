import { useEffect, useState } from "react";
import api from "../api";

export default function PackagePage() {
  const [form, setForm] = useState({
    PackageNumber: "",
    PackageName: "",
    PackageDescription: "",
    PackagePrice: "",
  });
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/packages");
    setPackages(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/packages", form);
    setMessage("Package saved.");
    setForm({ PackageNumber: "", PackageName: "", PackageDescription: "", PackagePrice: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Service Packages</h2>
        <p className="text-slate-500 text-sm">Manage washing packages and pricing.</p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Package Number</label>
          <input
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PackageNumber}
            onChange={(e) => setForm({ ...form, PackageNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Package Name</label>
          <input
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PackageName}
            onChange={(e) => setForm({ ...form, PackageName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Package Description</label>
          <input
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PackageDescription}
            onChange={(e) => setForm({ ...form, PackageDescription: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Package Price (RWF)</label>
          <input
            type="number"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PackagePrice}
            onChange={(e) => setForm({ ...form, PackagePrice: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
            Save Package
          </button>
          {message && <span className="text-sm text-emerald-600">{message}</span>}
        </div>
      </form>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Description</th>
              <th className="py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.PackageNumber} className="border-b last:border-b-0">
                <td className="py-2 font-medium text-slate-800">{p.PackageNumber}</td>
                <td className="py-2">{p.PackageName}</td>
                <td className="py-2">{p.PackageDescription}</td>
                <td className="py-2">{p.PackagePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
