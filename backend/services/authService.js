const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const { HttpError } = require("../utils/httpError");

const BCRYPT_SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt chỉ dùng 72 byte đầu của mật khẩu.
const MAX_PASSWORD_LENGTH = 72;
const USERNAME_PATTERN = /^[a-z0-9._]{3,50}$/;
const DEFAULT_ROLE = "STUDENT";

const MESSAGES = {
  INVALID_TYPE: "Tên đăng nhập và mật khẩu phải là chuỗi",
  REQUIRED: "Tên đăng nhập và mật khẩu là bắt buộc",
  INVALID_USERNAME: "Tên đăng nhập chỉ gồm 3–50 ký tự chữ thường, số, dấu chấm hoặc gạch dưới",
  PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`,
  PASSWORD_TOO_LONG: `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự`,
  USERNAME_TAKEN: "Tên đăng nhập đã tồn tại",
  INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu không đúng",
  ACCOUNT_LOCKED: "Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên"
};

function normalizeCredentials(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new HttpError(400, MESSAGES.INVALID_TYPE);
  }

  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername || !password) {
    throw new HttpError(400, MESSAGES.REQUIRED);
  }

  return { normalizedUsername, password };
}

function toPublicUser(user) {
  return { id: user.id, username: user.username, role: user.role };
}

async function register(username, password) {
  const { normalizedUsername } = normalizeCredentials(username, password);

  // Giới hạn ký tự hợp lệ ở phía máy chủ: chặn sớm dữ liệu chứa HTML/SQL bất thường.
  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    throw new HttpError(400, MESSAGES.INVALID_USERNAME);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, MESSAGES.PASSWORD_TOO_SHORT);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new HttpError(400, MESSAGES.PASSWORD_TOO_LONG);
  }

  const existingUser = await userRepository.findByUsername(normalizedUsername);
  if (existingUser) {
    throw new HttpError(409, MESSAGES.USERNAME_TAKEN);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  try {
    const user = await userRepository.create({ username: normalizedUsername, passwordHash, role: DEFAULT_ROLE });
    return toPublicUser(user);
  } catch (error) {
    // Hai yêu cầu đăng ký cùng tên gửi đồng thời: ràng buộc UNIQUE của CSDL là chốt chặn cuối.
    if (error.code === "ER_DUP_ENTRY") {
      throw new HttpError(409, MESSAGES.USERNAME_TAKEN);
    }
    throw error;
  }
}

async function login(username, password) {
  const { normalizedUsername } = normalizeCredentials(username, password);

  const user = await userRepository.findByUsername(normalizedUsername);
  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  // Dùng chung một thông báo để không tiết lộ tài khoản có tồn tại hay không.
  if (!isPasswordValid) {
    throw new HttpError(401, MESSAGES.INVALID_CREDENTIALS);
  }
  if (user.status !== "ACTIVE") {
    throw new HttpError(403, MESSAGES.ACCOUNT_LOCKED);
  }

  return toPublicUser(user);
}

module.exports = { register, login, MESSAGES };
