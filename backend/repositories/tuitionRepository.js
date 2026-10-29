const db = require("../config/db");

async function findInvoicesByStudent(studentId) {
  const [rows] = await db.getPool().execute(
    `SELECT i.invoice_id AS invoiceId, sm.semester_name AS semesterName, sm.academic_year AS academicYear,
            i.total_amount AS totalAmount, i.status, i.due_date AS dueDate,
            COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount END), 0) AS paidAmount
       FROM tuition_invoices i
       JOIN semesters sm ON sm.semester_id = i.semester_id
       LEFT JOIN payments p ON p.invoice_id = i.invoice_id
      WHERE i.student_id = ?
      GROUP BY i.invoice_id, sm.semester_name, sm.academic_year, i.total_amount, i.status, i.due_date
      ORDER BY i.created_at DESC`,
    [studentId]
  );
  return rows;
}

async function findPaymentsByInvoice(invoiceId) {
  const [rows] = await db.getPool().execute(
    `SELECT payment_id AS paymentId, amount, payment_date AS paymentDate, method, status,
            transaction_ref AS transactionRef
       FROM payments
      WHERE invoice_id = ?
      ORDER BY payment_date DESC`,
    [invoiceId]
  );
  return rows;
}

module.exports = { findInvoicesByStudent, findPaymentsByInvoice };
