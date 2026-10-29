const mysql = require("mysql2/promise");
const config = require("./env");

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config.db,
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
}

async function checkConnection() {
  const [rows] = await getPool().query("SELECT 1 AS ok");
  return rows[0].ok === 1;
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { getPool, checkConnection, closePool };
