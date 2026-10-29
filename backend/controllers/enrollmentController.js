const enrollmentService = require("../services/enrollmentService");

async function listSections(req, res) {
  const sections = await enrollmentService.getOpenSections(req.query.semesterId);
  res.json({ sections });
}

async function listStudentEnrollments(req, res) {
  const enrollments = await enrollmentService.getStudentEnrollments(req.params.studentId);
  res.json({ enrollments });
}

async function createEnrollment(req, res) {
  const { studentId, sectionId } = req.body || {};
  const enrollment = await enrollmentService.enroll(studentId, sectionId);
  res.status(201).json({ message: "Đăng ký học phần thành công", enrollment });
}

module.exports = { listSections, listStudentEnrollments, createEnrollment };
