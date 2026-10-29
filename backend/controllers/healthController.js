const db = require("../config/db");

function getStatus(req, res) {
  res.json({ status: "UP" });
}

async function getDatabaseStatus(req, res) {
  try {
    await db.checkConnection();
    res.json({ database: "UP" });
  } catch (error) {
    res.status(503).json({ database: "DOWN", message: "Không kết nối được cơ sở dữ liệu" });
  }
}

module.exports = { getStatus, getDatabaseStatus };
