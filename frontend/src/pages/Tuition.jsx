import { useEffect, useState } from "react";
import { getInvoices } from "../services/tuitionApi";
import "./Tuition.css";

// Tạm thời cố định, sẽ lấy từ phiên đăng nhập khi tích hợp module xác thực.
const DEMO_STUDENT_ID = 1;

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export default function Tuition() {
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getInvoices(DEMO_STUDENT_ID)
      .then(setInvoices)
      .catch(() => setMessage("Không tải được thông tin học phí"));
  }, []);

  return (
    <section className="card">
      <h1>Học phí và thanh toán</h1>
      {invoices.length === 0 && !message && <p>Chưa có hóa đơn học phí.</p>}
      <ul className="invoice-list">
        {invoices.map(invoice => (
          <li key={invoice.invoiceId}>
            <strong>
              {invoice.semesterName} – {invoice.academicYear}
            </strong>
            <span>Tổng: {currencyFormatter.format(invoice.totalAmount)}</span>
            <span>Đã đóng: {currencyFormatter.format(invoice.paidAmount)}</span>
            <span>Còn nợ: {currencyFormatter.format(invoice.remainingAmount)}</span>
            <span>Trạng thái: {invoice.status}</span>
          </li>
        ))}
      </ul>
      {message && <p className="message">{message}</p>}
    </section>
  );
}
