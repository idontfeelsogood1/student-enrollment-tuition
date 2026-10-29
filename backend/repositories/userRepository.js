const db = require("../config/db");

// Luôn dùng tham số "?" của mysql2, không nối chuỗi dữ liệu người dùng vào câu SQL (chống SQL Injection).
async function findByUsername(username) {
  const [rows] = await db.getPool().execute(
    `SELECT user_id AS id, username, password_hash AS passwordHash, role, status
       FROM users
      WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
}

async function create({ username, passwordHash, role }) {
  const [result] = await db.getPool().execute(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
    [username, passwordHash, role]
  );
  return { id: result.insertId, username, role };
}

module.exports = { findByUsername, create };
