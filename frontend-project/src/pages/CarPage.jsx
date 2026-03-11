import { useEffect, useState } from "react";
import api from "../api";

export default function CarPage() {
  const [form, setForm] = useState({
    PlateNumber: "",
    CarType: "",
    CarSize: "",
    DriverName: "",
    PhoneNumber: "",
  });
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/cars");
    setCars(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/cars", form);
    setMessage("Car saved.");
    setForm({ PlateNumber: "", CarType: "", CarSize: "", DriverName: "", PhoneNumber: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Car Registration</h2>
        <p className="text-slate-500 text-sm">Record driver and vehicle details.</p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["PlateNumber", "Plate Number"],
          ["CarType", "Car Type"],
          ["CarSize", "Car Size"],
          ["DriverName", "Driver Name"],
          ["PhoneNumber", "Phone Number"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="text-sm text-slate-600">{label}</label>
            <input
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          </div>
        ))}
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
            Save Car
          </button>
          {message && <span className="text-sm text-emerald-600">{message}</span>}
        </div>
      </form>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Plate</th>
              <th className="py-2">Type</th>
              <th className="py-2">Size</th>
              <th className="py-2">Driver</th>
              <th className="py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.PlateNumber} className="border-b last:border-b-0">
                <td className="py-2 font-medium text-slate-800">{c.PlateNumber}</td>
                <td className="py-2">{c.CarType}</td>
                <td className="py-2">{c.CarSize}</td>
                <td className="py-2">{c.DriverName}</td>
                <td className="py-2">{c.PhoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
