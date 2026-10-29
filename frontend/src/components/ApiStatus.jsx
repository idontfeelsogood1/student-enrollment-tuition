import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ApiStatus() {
  const [status, setStatus] = useState("đang kiểm tra...");

  useEffect(() => {
    api
      .get("/health")
      .then(response => setStatus(response.data.status))
      .catch(() => setStatus("không kết nối được"));
  }, []);

  return <p className="api-status">Backend: {status}</p>;
}
