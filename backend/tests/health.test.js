const request = require("supertest");
const app = require("../app");

describe("Health API", () => {
  test("GET /api/v1/health trả về trạng thái UP", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("UP");
  });

  test("Đường dẫn không tồn tại trả về 404", async () => {
    const response = await request(app).get("/api/v1/khong-ton-tai");

    expect(response.status).toBe(404);
  });
});
