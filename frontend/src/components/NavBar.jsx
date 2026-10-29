import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <strong>TDTU – Đăng ký học phần</strong>
      <NavLink to="/login">Đăng nhập</NavLink>
      <NavLink to="/enrollment">Đăng ký học phần</NavLink>
      <NavLink to="/tuition">Học phí</NavLink>
    </nav>
  );
}
