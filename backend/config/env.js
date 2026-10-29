require("dotenv").config({ quiet: true });

const config = {
  port: Number(process.env.PORT) || 8080,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || "university_db",
    user: process.env.DB_USERNAME || "root",
    // Mật khẩu chỉ đọc từ biến môi trường, không ghi cứng trong mã nguồn.
    password: process.env.DB_PASSWORD || ""
  }
};

module.exports = config;
