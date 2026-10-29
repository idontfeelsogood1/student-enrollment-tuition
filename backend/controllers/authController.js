const authService = require("../services/authService");

// Lỗi từ service (HttpError) được Express 5 chuyển tới errorHandler để trả mã HTTP tương ứng.
async function register(req, res) {
  const { username, password } = req.body || {};
  const user = await authService.register(username, password);
  res.status(201).json({ message: "Đăng ký thành công", user });
}

async function login(req, res) {
  const { username, password } = req.body || {};
  const user = await authService.login(username, password);
  res.status(200).json({ message: "Đăng nhập thành công", user });
}

module.exports = { register, login };
