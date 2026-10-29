const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");

const router = express.Router();

// Express 5 tự chuyển lỗi của hàm async tới errorHandler.
router.get("/sections", enrollmentController.listSections);
router.get("/students/:studentId", enrollmentController.listStudentEnrollments);
router.post("/", enrollmentController.createEnrollment);

module.exports = router;
