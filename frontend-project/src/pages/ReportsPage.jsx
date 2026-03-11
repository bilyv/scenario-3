import { useState } from "react";
import api from "../api";

export default function ReportsPage() {
  const [date, setDate] = useState("");
  const [daily, setDaily] = useState([]);
  const [recordNumber, setRecordNumber] = useState("");
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState("");

  const loadDaily = async () => {
    if (!date) return;
    const res = await api.get(`/reports/daily?date=${date}`);
    setDaily(res.data);
  };

  const loadBill = async () => {
    if (!recordNumber) return;
    try {
      const res = await api.get(`/reports/bill/${recordNumber}`);
      setBill(res.data);
      setMessage("");
    } catch (err) {
      setBill(null);
      setMessage(err?.response?.data?.message || "Record not found");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Reports</h2>
        <p className="text-slate-500 text-sm">Generate daily reports and customer bills.</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Daily Report</h3>
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div>
            <label className="text-sm text-slate-600">Payment Date</label>
            <input
              type="date"
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            onClick={loadDaily}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Generate Report
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Plate</th>
                <th className="py-2">Package</th>
                <th className="py-2">Description</th>
                <th className="py-2">Amount Paid</th>
                <th className="py-2">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((d, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 font-medium text-slate-800">{d.PlateNumber}</td>
                  <td className="py-2">{d.PackageName}</td>
                  <td className="py-2">{d.PackageDescription}</td>
                  <td className="py-2">{d.AmountPaid}</td>
                  <td className="py-2">{d.PaymentDate?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Bill by Service Record</h3>
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div>
            <label className="text-sm text-slate-600">Record Number</label>
            <input
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={recordNumber}
              onChange={(e) => setRecordNumber(e.target.value)}
            />
          </div>
          <button
            onClick={loadBill}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Generate Bill
          </button>
        </div>
        {message && <div className="text-sm text-neutral-700">{message}</div>}
        {bill && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">Record:</span> {bill.RecordNumber}</div>
              <div><span className="text-slate-500">Service Date:</span> {bill.ServiceDate?.slice(0, 10)}</div>
              <div><span className="text-slate-500">Plate:</span> {bill.PlateNumber}</div>
              <div><span className="text-slate-500">Driver:</span> {bill.DriverName}</div>
              <div><span className="text-slate-500">Phone:</span> {bill.PhoneNumber}</div>
              <div><span className="text-slate-500">Package:</span> {bill.PackageName}</div>
              <div><span className="text-slate-500">Description:</span> {bill.PackageDescription}</div>
              <div><span className="text-slate-500">Price:</span> {bill.PackagePrice} RWF</div>
              <div><span className="text-slate-500">Amount Paid:</span> {bill.AmountPaid || "N/A"}</div>
              <div><span className="text-slate-500">Payment Date:</span> {bill.PaymentDate?.slice(0, 10) || "N/A"}</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

