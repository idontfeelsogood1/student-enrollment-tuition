function notFoundHandler(req, res) {
  res.status(404).json({ message: "Không tìm thấy tài nguyên" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  res.status(status).json({
    // Không trả thông tin nội bộ (stack trace, lỗi SQL) về phía người dùng.
    message: status >= 500 ? "Lỗi hệ thống, vui lòng thử lại sau" : error.message
  });
}

module.exports = { notFoundHandler, errorHandler };
