const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contact = require("../models/Contact");
const ContactList = require("../models/ContactList");
const FollowUp = require("../models/FollowUp");
const Interaction = require("../models/Interaction");
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
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    isAdmin: Boolean(user.isAdmin || user.role === "admin"),
  };
}

// The token holds the user id and admin flag. It expires in 7 days.
function makeToken(user) {
  const userId = String(user._id || user.id);
  return jwt.sign(
    { userId, isAdmin: Boolean(user.isAdmin || user.role === "admin") },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
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

  const taken = await User.findOne({ email });
  if (taken) throw httpError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    isAdmin: false,
    role: "user",
  });

  return { user: publicUser(user), token: makeToken(user) };
}

async function login(body) {
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  const user = await User.findOne({ email });
  const correct = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message for "wrong email" and "wrong password".
  if (!correct) throw httpError(401, "Invalid email or password.");

  return { user: publicUser(user), token: makeToken(user) };
}

async function getMe(userId) {
  const user = await User.findOne({ _id: userId });
  if (!user) throw httpError(401, "Account not found. Please log in again.");
  return publicUser(user);
}

// Runs once when the server starts. Creates the admin account if it is missing,
// and seeds initial demo contacts and entities in MongoDB.
async function ensureAdminAccount() {
  let admin = await User.findOne({ email: ADMIN_EMAIL });

  if (!admin) {
    admin = await User.create({
      name: "Demo Admin",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      isAdmin: true,
      role: "admin",
    });
    console.log(`✅ Admin account created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  const adminId = String(admin._id || admin.id);
  const contactCount = await Contact.countDocuments({ userId: adminId });

  if (contactCount === 0) {
    const rawContacts = sampleContacts();
    const contactsWithUser = rawContacts.map((c) => ({
      ...c,
      _id: c.id,
      userId: adminId,
    }));
    const savedContacts = await Contact.insertMany(contactsWithUser);

    const rawLists = sampleLists(savedContacts, adminId);
    if (rawLists.length > 0) {
      await ContactList.insertMany(
        rawLists.map((l) => ({ ...l, _id: l.id, userId: adminId }))
      );
    }

    const rawFollowUps = sampleFollowUps(savedContacts, adminId);
    if (rawFollowUps.length > 0) {
      await FollowUp.insertMany(
        rawFollowUps.map((f) => ({ ...f, _id: f.id, userId: adminId }))
      );
    }

    const rawInteractions = sampleInteractions(savedContacts, adminId);
    if (rawInteractions.length > 0) {
      await Interaction.insertMany(
        rawInteractions.map((i) => ({ ...i, _id: i.id, userId: adminId }))
      );
    }

    console.log("✅ Seeded initial demo contacts and CRM entities in MongoDB.");
  }

  return publicUser(admin);
}

module.exports = { register, login, getMe, ensureAdminAccount };
