const db = require("../config/db");

async function findOpenSections(semesterId) {
  const [rows] = await db.getPool().execute(
    `SELECT s.section_id AS sectionId, s.section_code AS sectionCode, c.course_code AS courseCode,
            c.course_name AS courseName, c.credits, s.capacity, s.current_enrolled AS currentEnrolled,
            s.schedule
       FROM course_sections s
       JOIN courses c ON c.course_id = s.course_id
      WHERE s.semester_id = ?
      ORDER BY c.course_code, s.section_code`,
    [semesterId]
  );
  return rows;
}

async function findByStudent(studentId) {
  const [rows] = await db.getPool().execute(
    `SELECT e.enrollment_id AS enrollmentId, e.status, e.enrollment_date AS enrollmentDate,
            s.section_code AS sectionCode, c.course_name AS courseName, c.credits, s.schedule
       FROM enrollments e
       JOIN course_sections s ON s.section_id = e.section_id
       JOIN courses c ON c.course_id = s.course_id
      WHERE e.student_id = ?
      ORDER BY e.created_at DESC`,
    [studentId]
  );
  return rows;
}

// Khóa dòng lớp học phần (SELECT ... FOR UPDATE) trong transaction để tránh vượt sĩ số
// khi nhiều sinh viên đăng ký cùng lúc.
async function createEnrollment(studentId, sectionId) {
  const connection = await db.getPool().getConnection();
  try {
    await connection.beginTransaction();

    const [sections] = await connection.execute(
      "SELECT capacity, current_enrolled AS currentEnrolled FROM course_sections WHERE section_id = ? FOR UPDATE",
      [sectionId]
    );
    if (sections.length === 0) {
      await connection.rollback();
      return { status: "SECTION_NOT_FOUND" };
    }
    if (sections[0].currentEnrolled >= sections[0].capacity) {
      await connection.rollback();
      return { status: "SECTION_FULL" };
    }

    const [result] = await connection.execute(
      "INSERT INTO enrollments (student_id, section_id) VALUES (?, ?)",
      [studentId, sectionId]
    );
    await connection.execute(
      "UPDATE course_sections SET current_enrolled = current_enrolled + 1 WHERE section_id = ?",
      [sectionId]
    );

    await connection.commit();
    return { status: "CREATED", enrollmentId: result.insertId };
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return { status: "ALREADY_ENROLLED" };
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { findOpenSections, findByStudent, createEnrollment };
