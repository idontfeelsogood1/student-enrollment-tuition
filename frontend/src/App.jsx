import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ApiStatus from "./components/ApiStatus";
import Login from "./pages/Login";
import Enrollment from "./pages/Enrollment";
import Tuition from "./pages/Tuition";

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/tuition" element={<Tuition />} />
        </Routes>
        <ApiStatus />
      </main>
    </>
  );
}
