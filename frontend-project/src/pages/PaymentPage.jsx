import { useEffect, useState } from "react";
import api from "../api";

export default function PaymentPage() {
  const [form, setForm] = useState({
    PaymentNumber: "",
    AmountPaid: "",
    PaymentDate: "",
    RecordNumber: "",
  });
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [p, s] = await Promise.all([
      api.get("/payments"),
      api.get("/service-packages"),
    ]);
    setPayments(p.data);
    setServices(s.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/payments", form);
    setMessage("Payment saved.");
    setForm({ PaymentNumber: "", AmountPaid: "", PaymentDate: "", RecordNumber: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Payments</h2>
        <p className="text-slate-500 text-sm">Record payment at the end of a wash.</p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Payment Number</label>
          <input
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PaymentNumber}
            onChange={(e) => setForm({ ...form, PaymentNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Amount Paid (RWF)</label>
          <input
            type="number"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.AmountPaid}
            onChange={(e) => setForm({ ...form, AmountPaid: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Payment Date</label>
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.PaymentDate}
            onChange={(e) => setForm({ ...form, PaymentDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Service Record</label>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={form.RecordNumber}
            onChange={(e) => setForm({ ...form, RecordNumber: e.target.value })}
            required
          >
            <option value="">Select service record</option>
            {services.map((s) => (
              <option key={s.RecordNumber} value={s.RecordNumber}>
                {s.RecordNumber} - {s.PlateNumber} - {s.PackageName}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
            Save Payment
          </button>
          {message && <span className="text-sm text-neutral-700">{message}</span>}
        </div>
      </form>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Payment</th>
              <th className="py-2">Record</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.PaymentNumber} className="border-b last:border-b-0">
                <td className="py-2 font-medium text-slate-800">{p.PaymentNumber}</td>
                <td className="py-2">{p.RecordNumber}</td>
                <td className="py-2">{p.AmountPaid}</td>
                <td className="py-2">{p.PaymentDate?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

