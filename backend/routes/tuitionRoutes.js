const express = require("express");
const tuitionController = require("../controllers/tuitionController");

const router = express.Router();

router.get("/students/:studentId/invoices", tuitionController.listStudentInvoices);
router.get("/invoices/:invoiceId/payments", tuitionController.listInvoicePayments);

module.exports = router;
