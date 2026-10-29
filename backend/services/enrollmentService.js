const enrollmentRepository = require("../repositories/enrollmentRepository");
const { HttpError, parsePositiveInt } = require("../utils/httpError");

async function getOpenSections(semesterId) {
  return enrollmentRepository.findOpenSections(parsePositiveInt(semesterId, "semesterId"));
}

async function getStudentEnrollments(studentId) {
  return enrollmentRepository.findByStudent(parsePositiveInt(studentId, "studentId"));
}

async function enroll(studentId, sectionId) {
  const result = await enrollmentRepository.createEnrollment(
    parsePositiveInt(studentId, "studentId"),
    parsePositiveInt(sectionId, "sectionId")
  );

  switch (result.status) {
    case "CREATED":
      return { enrollmentId: result.enrollmentId };
    case "SECTION_NOT_FOUND":
      throw new HttpError(404, "Không tìm thấy lớp học phần");
    case "SECTION_FULL":
      throw new HttpError(409, "Lớp học phần đã đủ sĩ số");
    case "ALREADY_ENROLLED":
      throw new HttpError(409, "Sinh viên đã đăng ký lớp học phần này");
    default:
      throw new Error(`Trạng thái không hợp lệ: ${result.status}`);
  }
}

module.exports = { getOpenSections, getStudentEnrollments, enroll };
