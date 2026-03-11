require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cwsms-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 },
  })
);

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const [rows] = await pool.query(
    "SELECT id, username, password_hash FROM users WHERE username = ?",
    [username]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.user = { id: user.id, username: user.username };
  res.json({ id: user.id, username: user.username });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

app.get("/api/auth/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.session.user);
});

// --- Car (Insert + List for UI) ---
app.post("/api/cars", requireAuth, async (req, res) => {
  const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
  await pool.query(
    "INSERT INTO car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)",
    [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
  );
  res.json({ message: "Car saved" });
});

app.get("/api/cars", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM car ORDER BY PlateNumber");
  res.json(rows);
});

// --- Package (Insert + List for UI) ---
app.post("/api/packages", requireAuth, async (req, res) => {
  const { PackageNumber, PackageName, PackageDescription, PackagePrice } = req.body;
  await pool.query(
    "INSERT INTO package (PackageNumber, PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?, ?)",
    [PackageNumber, PackageName, PackageDescription, PackagePrice]
  );
  res.json({ message: "Package saved" });
});

app.get("/api/packages", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM package ORDER BY PackageNumber");
  res.json(rows);
});

// --- ServicePackage (Full CRUD) ---
app.post("/api/service-packages", requireAuth, async (req, res) => {
  const { RecordNumber, ServiceDate, PlateNumber, PackageNumber } = req.body;
  await pool.query(
    "INSERT INTO servicepackage (RecordNumber, ServiceDate, PlateNumber, PackageNumber) VALUES (?, ?, ?, ?)",
    [RecordNumber, ServiceDate, PlateNumber, PackageNumber]
  );
  res.json({ message: "Service record saved" });
});

app.get("/api/service-packages", requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT sp.RecordNumber, sp.ServiceDate, sp.PlateNumber, sp.PackageNumber, p.PackageName, p.PackageDescription, p.PackagePrice " +
      "FROM servicepackage sp JOIN package p ON sp.PackageNumber = p.PackageNumber ORDER BY sp.RecordNumber DESC"
  );
  res.json(rows);
});

app.put("/api/service-packages/:recordNumber", requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  const { ServiceDate, PlateNumber, PackageNumber } = req.body;
  await pool.query(
    "UPDATE servicepackage SET ServiceDate = ?, PlateNumber = ?, PackageNumber = ? WHERE RecordNumber = ?",
    [ServiceDate, PlateNumber, PackageNumber, recordNumber]
  );
  res.json({ message: "Service record updated" });
});

app.delete("/api/service-packages/:recordNumber", requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  await pool.query("DELETE FROM servicepackage WHERE RecordNumber = ?", [recordNumber]);
  res.json({ message: "Service record deleted" });
});

// --- Payment (Insert + List for UI/Reports) ---
app.post("/api/payments", requireAuth, async (req, res) => {
  const { PaymentNumber, AmountPaid, PaymentDate, RecordNumber } = req.body;
  await pool.query(
    "INSERT INTO payment (PaymentNumber, AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?, ?)",
    [PaymentNumber, AmountPaid, PaymentDate, RecordNumber]
  );
  res.json({ message: "Payment saved" });
});

app.get("/api/payments", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM payment ORDER BY PaymentDate DESC");
  res.json(rows);
});

// --- Reports ---
app.get("/api/reports/bill/:recordNumber", requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  const [rows] = await pool.query(
    "SELECT sp.RecordNumber, sp.ServiceDate, c.PlateNumber, c.DriverName, c.PhoneNumber, p.PackageName, p.PackageDescription, p.PackagePrice, pay.AmountPaid, pay.PaymentDate " +
      "FROM servicepackage sp " +
      "JOIN car c ON sp.PlateNumber = c.PlateNumber " +
      "JOIN package p ON sp.PackageNumber = p.PackageNumber " +
      "LEFT JOIN payment pay ON sp.RecordNumber = pay.RecordNumber " +
      "WHERE sp.RecordNumber = ?",
    [recordNumber]
  );

  if (rows.length === 0) return res.status(404).json({ message: "Record not found" });
  res.json(rows[0]);
});

app.get("/api/reports/daily", requireAuth, async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  if (!date) return res.status(400).json({ message: "date is required" });

  const [rows] = await pool.query(
    "SELECT c.PlateNumber, p.PackageName, p.PackageDescription, pay.AmountPaid, pay.PaymentDate " +
      "FROM payment pay " +
      "JOIN servicepackage sp ON pay.RecordNumber = sp.RecordNumber " +
      "JOIN car c ON sp.PlateNumber = c.PlateNumber " +
      "JOIN package p ON sp.PackageNumber = p.PackageNumber " +
      "WHERE DATE(pay.PaymentDate) = ? ORDER BY pay.PaymentDate DESC",
    [date]
  );
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`CWSMS backend running on http://localhost:${PORT}`);
});

