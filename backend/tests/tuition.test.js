const request = require("supertest");

jest.mock("../repositories/tuitionRepository");
const tuitionRepository = require("../repositories/tuitionRepository");
const app = require("../app");

describe("Tuition API", () => {
  afterEach(() => jest.resetAllMocks());

  test("Tính số tiền còn nợ của hóa đơn", async () => {
    tuitionRepository.findInvoicesByStudent.mockResolvedValue([
      { invoiceId: 1, totalAmount: "12000000.00", paidAmount: "5000000.00", status: "PARTIAL" }
    ]);

    const response = await request(app).get("/api/v1/tuition/students/1/invoices");

    expect(response.status).toBe(200);
    expect(response.body.invoices[0].remainingAmount).toBe(7000000);
  });

  test("Từ chối studentId không hợp lệ", async () => {
    const response = await request(app).get("/api/v1/tuition/students/-5/invoices");

    expect(response.status).toBe(400);
    expect(tuitionRepository.findInvoicesByStudent).not.toHaveBeenCalled();
  });

  test("Lấy lịch sử thanh toán của hóa đơn", async () => {
    tuitionRepository.findPaymentsByInvoice.mockResolvedValue([{ paymentId: 3, amount: "5000000.00" }]);

    const response = await request(app).get("/api/v1/tuition/invoices/1/payments");

    expect(response.status).toBe(200);
    expect(response.body.payments).toHaveLength(1);
  });
});
