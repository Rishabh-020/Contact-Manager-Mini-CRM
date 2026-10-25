const crypto = require("crypto");
const { getContactMap, saveContactMap } = require("../config/db");
const httpError = require("../utils/httpError");
const { sampleContacts } = require("./sampleContacts");

// The fields a user is allowed to send.
const FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "designation",
  "tags",
  "notes",
  "isFavorite",
  "followUpDate",
];

// Gets the contact list of ONE user from the map.
function getMyList(userId) {
  return getContactMap()[userId] || [];
}

// Saves the contact list of ONE user back into the map.
function saveMyList(userId, list) {
  const map = getContactMap();
  map[userId] = list;
  saveContactMap(map);
}

// Keeps only the allowed fields from the request.
function pickFields(body) {
  const result = {};
  FIELDS.forEach((field) => {
    if (body[field] !== undefined) result[field] = body[field];
  });
  return result;
}

// Trims text and makes the email lowercase.
function cleanFields(fields) {
  const result = { ...fields };
  [
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "designation",
    "notes",
  ].forEach((field) => {
    if (result[field] !== undefined)
      result[field] = String(result[field]).trim();
  });
  if (result.email !== undefined) result.email = result.email.toLowerCase();
  if (result.tags !== undefined) {
    result.tags = Array.isArray(result.tags)
      ? result.tags.map((t) => String(t).trim()).filter(Boolean)
      : [];
  }
  return result;
}

function checkFirstName(value) {
  if (!String(value || "").trim())
    throw httpError(400, "First name is required.");
}

// Stops a second active contact with the same email in this user's list.
function checkEmailFree(list, email, ownId) {
  if (!email) return;
  const taken = list.some(
    (c) =>
      !c.isDeleted &&
      c.id !== ownId &&
      (c.email || "").toLowerCase() === email.toLowerCase(),
  );
  if (taken) throw httpError(409, "A contact with this email already exists.");
}

// Finds one contact in the user's list, or stops with 404.
function findMine(list, id) {
  const contact = list.find((c) => c.id === id);
  if (!contact) throw httpError(404, "Contact not found.");
  return contact;
}

// ---------- The functions the controller uses ----------

function listContacts(userId, query) {
  const status = query.status || "active";
  const search = String(query.search || "").toLowerCase();
  const limit = Math.min(100, Number(query.limit) || 20);
  const page = Math.max(1, Number(query.page) || 1);

  let list = getMyList(userId);
  if (status === "active") list = list.filter((c) => !c.isDeleted);
  if (status === "deleted") list = list.filter((c) => c.isDeleted);
  if (query.favorite === "true") list = list.filter((c) => c.isFavorite);
  if (search) {
    list = list.filter((c) =>
      [c.firstName, c.lastName, c.email, c.phone, c.company].some((v) =>
        (v || "").toLowerCase().includes(search),
      ),
    );
  }
  list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    contacts: list.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

function createContact(userId, body) {
  const fields = cleanFields(pickFields(body));
  checkFirstName(fields.firstName);

  const list = getMyList(userId);
  checkEmailFree(list, fields.email, null);

  const now = new Date().toISOString();
  const contact = {
    id: crypto.randomUUID(),
    lastName: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    tags: [],
    notes: "",
    isFavorite: false,
    followUpDate: null,
    ...fields,
    isDeleted: false,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  list.push(contact);
  saveMyList(userId, list);
  return contact;
}

function updateContact(userId, id, body) {
  const list = getMyList(userId);
  const contact = findMine(list, id);
  const changes = cleanFields(pickFields(body));

  if (changes.firstName !== undefined) checkFirstName(changes.firstName);
  const email = changes.email !== undefined ? changes.email : contact.email;
  checkEmailFree(list, email, id);

  Object.assign(contact, changes, { updatedAt: new Date().toISOString() });
  saveMyList(userId, list);
  return contact;
}

// Soft delete: the contact moves to the trash. Nothing is erased.
function softDeleteContact(userId, id) {
  const list = getMyList(userId);
  const contact = findMine(list, id);
  const now = new Date().toISOString();
  Object.assign(contact, { isDeleted: true, deletedAt: now, updatedAt: now });
  saveMyList(userId, list);
  return contact;
}

function restoreContact(userId, id) {
  const list = getMyList(userId);
  const contact = findMine(list, id);
  checkEmailFree(list, contact.email, id);
  Object.assign(contact, {
    isDeleted: false,
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  });
  saveMyList(userId, list);
  return contact;
}

function toggleFavorite(userId, id) {
  const list = getMyList(userId);
  const contact = findMine(list, id);
  contact.isFavorite = !contact.isFavorite;
  contact.updatedAt = new Date().toISOString();
  saveMyList(userId, list);
  return contact;
}

// Permanent delete: only for contacts already in the trash.
function permanentDeleteContact(userId, id) {
  const list = getMyList(userId);
  const contact = findMine(list, id);
  if (!contact.isDeleted) {
    throw httpError(400, "Move the contact to Deleted Contacts first.");
  }
  saveMyList(
    userId,
    list.filter((c) => c.id !== id),
  );
}

// Only the admin can bring back the 6 sample contacts.
function resetDemoContacts(userId, isAdmin) {
  if (!isAdmin) {
    throw httpError(403, "Only the demo admin can restore sample contacts.");
  }
  const samples = sampleContacts();
  saveMyList(userId, samples);
  return samples;
}

module.exports = {
  listContacts,
  createContact,
  updateContact,
  softDeleteContact,
  restoreContact,
  toggleFavorite,
  permanentDeleteContact,
  resetDemoContacts,
};
