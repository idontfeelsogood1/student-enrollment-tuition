const tuitionRepository = require("../repositories/tuitionRepository");
const { parsePositiveInt } = require("../utils/httpError");

async function getStudentInvoices(studentId) {
  const invoices = await tuitionRepository.findInvoicesByStudent(parsePositiveInt(studentId, "studentId"));
  return invoices.map(invoice => {
    const totalAmount = Number(invoice.totalAmount);
    const paidAmount = Number(invoice.paidAmount);
    return {
      ...invoice,
      totalAmount,
      paidAmount,
      remainingAmount: Math.max(totalAmount - paidAmount, 0)
    };
  });
}

async function getInvoicePayments(invoiceId) {
  return tuitionRepository.findPaymentsByInvoice(parsePositiveInt(invoiceId, "invoiceId"));
}

module.exports = { getStudentInvoices, getInvoicePayments };
