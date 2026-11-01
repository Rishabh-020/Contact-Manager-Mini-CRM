const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  getUsers,
  saveUsers,
  getContactMap,
  saveContactMap,
  getListMap,
  saveListMap,
  getFollowUpMap,
  saveFollowUpMap,
  getInteractionMap,
  saveInteractionMap,
} = require("../config/db");
const {
  sampleContacts,
  sampleLists,
  sampleFollowUps,
  sampleInteractions,
} = require("./sampleContacts");
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
    { expiresIn: "7d" },
  );
}

function checkEmail(email) {
  if (!email || !email.includes("@"))
    throw httpError(400, "Please enter a valid email address.");
}

function checkPassword(password) {
  if (!password || password.length < 6) {
    throw httpError(400, "Password must be at least 6 characters.");
  }
}

// ---------- The functions the controller uses ----------

async function register(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!name) throw httpError(400, "Name is required.");
  checkEmail(email);
  checkPassword(password);

  const users = getUsers();
  const taken = users.some((u) => u.email === email);
  if (taken) throw httpError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
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

  // Initialize empty data structures for the new user
  const contactMap = getContactMap();
  contactMap[user.id] = [];
  saveContactMap(contactMap);

  const listMap = getListMap();
  listMap[user.id] = [];
  saveListMap(listMap);

  const followUpMap = getFollowUpMap();
  followUpMap[user.id] = [];
  saveFollowUpMap(followUpMap);

  const interactionMap = getInteractionMap();
  interactionMap[user.id] = [];
  saveInteractionMap(interactionMap);

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
// and gives it the 6 sample contacts and demo entities.
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

  const contactMap = getContactMap();
  let contacts = contactMap[admin.id];
  if (!contacts || contacts.length === 0) {
    contacts = sampleContacts();
    contactMap[admin.id] = contacts;
    saveContactMap(contactMap);
  }

  const listMap = getListMap();
  if (!listMap[admin.id] || listMap[admin.id].length === 0) {
    listMap[admin.id] = sampleLists(contacts, admin.id);
    saveListMap(listMap);
  }

  const followUpMap = getFollowUpMap();
  if (!followUpMap[admin.id] || followUpMap[admin.id].length === 0) {
    followUpMap[admin.id] = sampleFollowUps(contacts, admin.id);
    saveFollowUpMap(followUpMap);
  }

  const interactionMap = getInteractionMap();
  if (!interactionMap[admin.id] || interactionMap[admin.id].length === 0) {
    interactionMap[admin.id] = sampleInteractions(contacts, admin.id);
    saveInteractionMap(interactionMap);
  }

  return admin;
}

module.exports = { register, login, getMe, ensureAdminAccount };
