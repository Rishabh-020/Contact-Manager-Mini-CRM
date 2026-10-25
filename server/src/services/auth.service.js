// TODO: auth service
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  getUsers,
  saveUsers,
  getContactMap,
  saveContactMap,
} = require("../config/db");
const { sampleContacts } = require("./sampleContacts");
const httpError = require("../utils/httpError");

const ADMIN_EMAIL = "admin@minicrm.college";
const ADMIN_PASSWORD = "password123";

// Only these fields go to the browser. The password hash never does.
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}

// The token holds the user id and admin flag. It expires in 7 days.
function makeToken(user) {
  return jwt.sign(
    { userId: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

// Creates a normal account. It starts with NO contacts.
async function register(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (name.length < 2)
    throw httpError(400, "Name must be at least 2 characters.");
  if (!email.includes("@")) throw httpError(400, "Please enter a valid email.");
  if (password.length < 6)
    throw httpError(400, "Password must be at least 6 characters.");

  const passwordHash = await bcrypt.hash(password, 10);

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw httpError(409, "An account with this email already exists.");
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);

  // Add an empty list for this user in the contacts map.
  const map = getContactMap();
  map[user.id] = [];
  saveContactMap(map);

  return { user: publicUser(user), token: makeToken(user) };
}

async function login(body) {
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  const user = getUsers().find((u) => u.email === email);
  const correct = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message for "wrong email" and "wrong password".
  if (!correct) throw httpError(401, "Invalid email or password.");

  return { user: publicUser(user), token: makeToken(user) };
}

function getMe(userId) {
  const user = getUsers().find((u) => u.id === userId);
  if (!user) throw httpError(401, "Account not found. Please log in again.");
  return publicUser(user);
}

// Runs once when the server starts. Creates the admin account if it is missing,
// and gives it the 6 sample contacts.
async function ensureAdminAccount() {
  const users = getUsers();
  let admin = users.find((u) => u.email === ADMIN_EMAIL);

  if (!admin) {
    admin = {
      id: crypto.randomUUID(),
      name: "Demo Admin",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    saveUsers(users);
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  const map = getContactMap();
  if (!map[admin.id]) {
    map[admin.id] = sampleContacts();
    saveContactMap(map);
  }
}

module.exports = { register, login, getMe, ensureAdminAccount };