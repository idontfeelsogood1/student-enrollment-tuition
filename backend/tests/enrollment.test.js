const request = require("supertest");

jest.mock("../repositories/enrollmentRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");
const app = require("../app");

describe("Enrollment API", () => {
  afterEach(() => jest.resetAllMocks());

  test("Lấy danh sách lớp học phần theo học kỳ", async () => {
    enrollmentRepository.findOpenSections.mockResolvedValue([{ sectionId: 1, sectionCode: "502045_01" }]);

    const response = await request(app).get("/api/v1/enrollments/sections?semesterId=1");

    expect(response.status).toBe(200);
    expect(response.body.sections).toHaveLength(1);
    expect(enrollmentRepository.findOpenSections).toHaveBeenCalledWith(1);
  });

  test("Từ chối semesterId không hợp lệ", async () => {
    const response = await request(app).get("/api/v1/enrollments/sections?semesterId=abc");

    expect(response.status).toBe(400);
    expect(enrollmentRepository.findOpenSections).not.toHaveBeenCalled();
  });

  test("Đăng ký học phần thành công", async () => {
    enrollmentRepository.createEnrollment.mockResolvedValue({ status: "CREATED", enrollmentId: 10 });

    const response = await request(app).post("/api/v1/enrollments").send({ studentId: 1, sectionId: 2 });

    expect(response.status).toBe(201);
    expect(response.body.enrollment.enrollmentId).toBe(10);
  });

  test("Trả 409 khi lớp đã đủ sĩ số", async () => {
    enrollmentRepository.createEnrollment.mockResolvedValue({ status: "SECTION_FULL" });

    const response = await request(app).post("/api/v1/enrollments").send({ studentId: 1, sectionId: 2 });

    expect(response.status).toBe(409);
  });

  test("Trả 409 khi đăng ký trùng", async () => {
    enrollmentRepository.createEnrollment.mockResolvedValue({ status: "ALREADY_ENROLLED" });

    const response = await request(app).post("/api/v1/enrollments").send({ studentId: 1, sectionId: 2 });

    expect(response.status).toBe(409);
  });
});
