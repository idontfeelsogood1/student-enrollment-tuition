import { useEffect, useState } from "react";
import { enroll, getSections } from "../services/enrollmentApi";

// Tạm thời cố định, sẽ lấy từ phiên đăng nhập khi tích hợp module xác thực.
const DEMO_STUDENT_ID = 1;
const DEMO_SEMESTER_ID = 1;

export default function Enrollment() {
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSections(DEMO_SEMESTER_ID)
      .then(setSections)
      .catch(() => setMessage("Không tải được danh sách lớp học phần"));
  }, []);

  async function handleEnroll(sectionId) {
    try {
      const result = await enroll(DEMO_STUDENT_ID, sectionId);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng ký thất bại");
    }
  }

  return (
    <section className="card">
      <h1>Đăng ký học phần</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Mã lớp</th>
            <th>Môn học</th>
            <th>Tín chỉ</th>
            <th>Sĩ số</th>
            <th>Lịch học</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sections.map(section => (
            <tr key={section.sectionId}>
              <td>{section.sectionCode}</td>
              <td>{section.courseName}</td>
              <td>{section.credits}</td>
              <td>
                {section.currentEnrolled}/{section.capacity}
              </td>
              <td>{section.schedule}</td>
              <td>
                <button onClick={() => handleEnroll(section.sectionId)}>Đăng ký</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <p className="message">{message}</p>}
    </section>
  );
}
