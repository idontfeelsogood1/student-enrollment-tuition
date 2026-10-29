const express = require("express");
const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const enrollmentRoutes = require("./enrollmentRoutes");
const tuitionRoutes = require("./tuitionRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/tuition", tuitionRoutes);

module.exports = router;
