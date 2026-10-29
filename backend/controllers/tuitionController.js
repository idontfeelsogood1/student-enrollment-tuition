const tuitionService = require("../services/tuitionService");

async function listStudentInvoices(req, res) {
  const invoices = await tuitionService.getStudentInvoices(req.params.studentId);
  res.json({ invoices });
}

async function listInvoicePayments(req, res) {
  const payments = await tuitionService.getInvoicePayments(req.params.invoiceId);
  res.json({ payments });
}

module.exports = { listStudentInvoices, listInvoicePayments };
