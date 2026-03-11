require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db");

const [,, username, password] = process.argv;
if (!username || !password) {
  console.log("Usage: node scripts/create-user.js <username> <password>");
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
    [username, hash]
  );
  console.log("User saved:", username);
  process.exit(0);
})();
