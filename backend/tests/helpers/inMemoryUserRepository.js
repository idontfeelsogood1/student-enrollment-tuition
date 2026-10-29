// Thay thế userRepository khi kiểm thử để không phụ thuộc MySQL.
const users = [];
let nextId = 1;

async function findByUsername(username) {
  return users.find(user => user.username === username) || null;
}

async function create({ username, passwordHash, role }) {
  const user = { id: nextId++, username, passwordHash, role, status: "ACTIVE" };
  users.push(user);
  return { id: user.id, username, role };
}

function lockUser(username) {
  users.find(user => user.username === username).status = "LOCKED";
}

module.exports = { findByUsername, create, lockUser };
