const request = require("supertest");

jest.mock("../repositories/userRepository", () => require("./helpers/inMemoryUserRepository"));
const userRepository = require("../repositories/userRepository");
const app = require("../app");

describe("API Đăng ký / Đăng nhập", () => {
  const username = `student_${Date.now()}`;
  const password = "Student@123";

  function register(body) {
    return request(app).post("/api/v1/auth/register").send(body);
  }

  function login(body) {
    return request(app).post("/api/v1/auth/login").send(body);
  }

  test("Đăng ký tài khoản thành công", async () => {
    const response = await register({ username, password });

    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(username);
    expect(response.body.user.role).toBe("STUDENT");
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  test("Không cho đăng ký trùng tên (không phân biệt hoa thường, khoảng trắng)", async () => {
    const response = await register({ username: `  ${username.toUpperCase()} `, password });

    expect(response.status).toBe(409);
  });

  test("Đăng nhập thành công", async () => {
    const response = await login({ username, password });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Đăng nhập thành công");
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  test("Từ chối mật khẩu sai", async () => {
    const response = await login({ username, password: "WrongPass123" });

    expect(response.status).toBe(401);
  });

  test("Tài khoản không tồn tại trả cùng thông báo với mật khẩu sai", async () => {
    const wrongPassword = await login({ username, password: "WrongPass123" });
    const unknownUser = await login({ username: "khong_ton_tai", password });

    expect(unknownUser.status).toBe(401);
    expect(unknownUser.body.message).toBe(wrongPassword.body.message);
  });

  test("Từ chối mật khẩu quá ngắn", async () => {
    const response = await register({ username: `short_${Date.now()}`, password: "123" });

    expect(response.status).toBe(400);
  });

  test("Từ chối mật khẩu dài hơn 72 ký tự", async () => {
    const response = await register({ username: `long_${Date.now()}`, password: "a".repeat(73) });

    expect(response.status).toBe(400);
  });

  test("Từ chối tên đăng nhập chỉ chứa khoảng trắng", async () => {
    const response = await register({ username: "   ", password });

    expect(response.status).toBe(400);
  });

  test("Từ chối khi thiếu mật khẩu", async () => {
    const response = await register({ username: `missing_${Date.now()}` });

    expect(response.status).toBe(400);
  });

  test("Từ chối dữ liệu sai kiểu", async () => {
    const response = await login({ username: { $ne: "" }, password: ["x"] });

    expect(response.status).toBe(400);
  });

  test.each([["<script>alert(1)</script>"], ["admin' OR '1'='1"]])(
    "Từ chối tên đăng nhập chứa ký tự nguy hiểm: %s",
    async maliciousUsername => {
      const response = await register({ username: maliciousUsername, password });

      expect(response.status).toBe(400);
    }
  );

  test("Từ chối đăng nhập tài khoản bị khóa", async () => {
    const lockedUsername = `locked_${Date.now()}`;
    await register({ username: lockedUsername, password });
    userRepository.lockUser(lockedUsername);

    const response = await login({ username: lockedUsername, password });

    expect(response.status).toBe(403);
  });

  test("Body JSON sai định dạng trả 400", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send("{username:");

    expect(response.status).toBe(400);
  });
});
