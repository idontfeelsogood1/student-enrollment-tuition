import { useState } from "react";
import { login } from "../services/authApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setMessage("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(username.trim(), password);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không kết nối được máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card">
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Tên đăng nhập / MSSV
          <input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      {/* Hiển thị bằng JSX thông thường để React tự escape, tránh XSS. */}
      {message && <p className="message">{message}</p>}
    </section>
  );
}
