import { useEffect, useState } from "react";
import api from "../api";

export default function ServicePage() {
  const [form, setForm] = useState({
    RecordNumber: "",
    ServiceDate: "",
    PlateNumber: "",
    PackageNumber: "",
  });
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const load = async () => {
    const [s, c, p] = await Promise.all([
      api.get("/service-packages"),
      api.get("/cars"),
      api.get("/packages"),
    ]);
    setServices(s.data);
    setCars(c.data);
    setPackages(p.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/service-packages/${form.RecordNumber}`, {
        ServiceDate: form.ServiceDate,
        PlateNumber: form.PlateNumber,
        PackageNumber: form.PackageNumber,
      });
      setMessage("Service record updated.");
    } else {
      await api.post("/service-packages", form);
      setMessage("Service record saved.");
    }
    setForm({ RecordNumber: "", ServiceDate: "", PlateNumber: "", PackageNumber: "" });
    setEditing(false);
    load();
  };

  const editRow = (row) => {
    setForm({
      RecordNumber: row.RecordNumber,
      ServiceDate: row.ServiceDate?.slice(0, 10) || "",
      PlateNumber: row.PlateNumber,
      PackageNumber: row.PackageNumber,
    });
    setEditing(true);
  };

  const removeRow = async (recordNumber) => {
    await api.delete(`/service-packages/${recordNumber}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Service Records</h2>
        <p className="text-slate-500 text-sm">Create, update, or delete washing records.</p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Record Number</label>
          <input
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.RecordNumber}
            onChange={(e) => setForm({ ...form, RecordNumber: e.target.value })}
            required
            disabled={editing}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Service Date</label>
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.ServiceDate}
            onChange={(e) => setForm({ ...form, ServiceDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Car Plate</label>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PlateNumber}
            onChange={(e) => setForm({ ...form, PlateNumber: e.target.value })}
            required
          >
            <option value="">Select car</option>
            {cars.map((c) => (
              <option key={c.PlateNumber} value={c.PlateNumber}>
                {c.PlateNumber} - {c.DriverName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Package</label>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PackageNumber}
            onChange={(e) => setForm({ ...form, PackageNumber: e.target.value })}
            required
          >
            <option value="">Select package</option>
            {packages.map((p) => (
              <option key={p.PackageNumber} value={p.PackageNumber}>
                {p.PackageName} ({p.PackagePrice} RWF)
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
            {editing ? "Update Record" : "Save Record"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({ RecordNumber: "", ServiceDate: "", PlateNumber: "", PackageNumber: "" });
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
          )}
          {message && <span className="text-sm text-neutral-700">{message}</span>}
        </div>
      </form>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Record</th>
              <th className="py-2">Date</th>
              <th className="py-2">Car</th>
              <th className="py-2">Package</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.RecordNumber} className="border-b last:border-b-0">
                <td className="py-2 font-medium text-slate-800">{s.RecordNumber}</td>
                <td className="py-2">{s.ServiceDate?.slice(0, 10)}</td>
                <td className="py-2">{s.PlateNumber}</td>
                <td className="py-2">{s.PackageName}</td>
                <td className="py-2 flex gap-2">
                  <button
                    onClick={() => editRow(s)}
                    className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeRow(s.RecordNumber)}
                    className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

