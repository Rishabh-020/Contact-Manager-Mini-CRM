const Contact = require("../models/Contact");
const FollowUp = require("../models/FollowUp");
const Interaction = require("../models/Interaction");
const ContactList = require("../models/ContactList");
const httpError = require("../utils/httpError");
const { generateCSV, parseCSV } = require("../utils/csv");
const {
  sampleContacts,
  sampleLists,
  sampleFollowUps,
  sampleInteractions,
} = require("./sampleContacts");

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
  "photoUrl",
  "isFavorite",
  "followUpDate",
];

function pickFields(body) {
  const result = {};
  FIELDS.forEach((field) => {
    if (body[field] !== undefined) result[field] = body[field];
  });
  return result;
}

function cleanFields(fields) {
  const result = { ...fields };
  ["firstName", "lastName", "company", "designation", "notes", "photoUrl"].forEach((key) => {
    if (result[key] !== undefined) {
      result[key] = String(result[key]).trim();
    }
  });
  if (result.email !== undefined) {
    result.email = String(result.email).trim().toLowerCase();
  }
  if (result.phone !== undefined) {
    result.phone = String(result.phone).trim();
  }
  if (result.tags !== undefined) {
    result.tags = Array.isArray(result.tags)
      ? result.tags.map((t) => String(t).trim()).filter(Boolean)
      : [];
  }
  return result;
}

function formatDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = String(obj._id || obj.id);
  delete obj.__v;
  return obj;
}

// Parses ?sort=-createdAt or ?sort=firstName into Mongoose sort object
function parseSortParam(sortParam) {
  if (!sortParam) return { createdAt: -1 };
  const isDesc = sortParam.startsWith("-");
  const field = isDesc ? sortParam.substring(1) : sortParam;
  const allowed = ["createdAt", "updatedAt", "firstName", "lastName", "company", "email"];
  if (!allowed.includes(field)) return { createdAt: -1 };
  return { [field]: isDesc ? -1 : 1 };
}

// ---------- The functions the controller uses ----------

async function listContacts(userId, query = {}) {
  const q = query || {};
  const status = q.status || "active";
  const search = String(q.search || "").trim();
  const limit = Math.min(100, Number(q.limit) || 20);
  const page = Math.max(1, Number(q.page) || 1);

  const filter = { userId: String(userId) };

  if (status === "active") filter.isDeleted = false;
  if (status === "deleted") filter.isDeleted = true;
  if (q.favorite === "true") filter.isFavorite = true;
  if (q.tag && q.tag !== "ALL") filter.tags = q.tag;

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { company: regex },
      { designation: regex },
    ];
  }

  const sortOrder = parseSortParam(q.sort);

  const total = await Contact.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  const docs = await Contact.find(filter)
    .sort(sortOrder)
    .skip(start)
    .limit(limit);

  return {
    contacts: docs.map(formatDoc),
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

async function getContactById(userId, id) {
  const contact = await Contact.findOne({ _id: id, userId: String(userId) });
  if (!contact) throw httpError(404, "Contact not found.");
  return formatDoc(contact);
}

async function createContact(userId, body) {
  const clean = cleanFields(pickFields(body));
  if (!clean.firstName) throw httpError(400, "First name is required.");

  const uId = String(userId);

  // Duplicate detection by email
  if (clean.email) {
    const taken = await Contact.findOne({
      userId: uId,
      email: clean.email,
      isDeleted: false,
    });
    if (taken) throw httpError(409, "A contact with this email already exists.");
  }

  // Duplicate detection by phone
  if (clean.phone) {
    const phoneTaken = await Contact.findOne({
      userId: uId,
      phone: clean.phone,
      isDeleted: false,
    });
    if (phoneTaken) throw httpError(409, "A contact with this phone number already exists.");
  }

  const created = await Contact.create({
    ...clean,
    userId: uId,
    isDeleted: false,
    deletedAt: null,
  });

  return formatDoc(created);
}

async function updateContact(userId, id, body) {
  const uId = String(userId);
  const contact = await Contact.findOne({ _id: id, userId: uId });
  if (!contact) throw httpError(404, "Contact not found.");

  const clean = cleanFields(pickFields(body));
  if (clean.firstName !== undefined && !clean.firstName) {
    throw httpError(400, "First name cannot be empty.");
  }

  // Duplicate detection by email (excluding current contact)
  if (clean.email && clean.email !== contact.email) {
    const taken = await Contact.findOne({
      userId: uId,
      _id: { $ne: id },
      email: clean.email,
      isDeleted: false,
    });
    if (taken) throw httpError(409, "A contact with this email already exists.");
  }

  // Duplicate detection by phone (excluding current contact)
  if (clean.phone && clean.phone !== contact.phone) {
    const phoneTaken = await Contact.findOne({
      userId: uId,
      _id: { $ne: id },
      phone: clean.phone,
      isDeleted: false,
    });
    if (phoneTaken) throw httpError(409, "A contact with this phone number already exists.");
  }

  Object.assign(contact, clean);
  await contact.save();

  return formatDoc(contact);
}

async function softDeleteContact(userId, id) {
  const contact = await Contact.findOne({ _id: id, userId: String(userId) });
  if (!contact) throw httpError(404, "Contact not found.");

  contact.isDeleted = true;
  contact.deletedAt = new Date();
  await contact.save();

  return formatDoc(contact);
}

async function restoreContact(userId, id) {
  const contact = await Contact.findOne({ _id: id, userId: String(userId) });
  if (!contact) throw httpError(404, "Contact not found.");

  contact.isDeleted = false;
  contact.deletedAt = null;
  await contact.save();

  return formatDoc(contact);
}

async function toggleFavorite(userId, id) {
  const contact = await Contact.findOne({ _id: id, userId: String(userId) });
  if (!contact) throw httpError(404, "Contact not found.");

  contact.isFavorite = !contact.isFavorite;
  await contact.save();

  return formatDoc(contact);
}

async function permanentDeleteContact(userId, id) {
  const uId = String(userId);
  const deleted = await Contact.findOneAndDelete({ _id: id, userId: uId });
  if (!deleted) throw httpError(404, "Contact not found.");

  // Cascading cleanup across lists, followups, interactions
  await FollowUp.deleteMany({ contactId: id, userId: uId });
  await Interaction.deleteMany({ contactId: id, userId: uId });
  await ContactList.updateMany({ userId: uId }, { $pull: { contactIds: id } });
}

// Server-side CSV Export matching filtered view
async function exportContactsCSV(userId, query = {}) {
  const filter = { userId: String(userId), isDeleted: false };
  if (query.favorite === "true") filter.isFavorite = true;
  if (query.tag && query.tag !== "ALL") filter.tags = query.tag;

  if (query.search) {
    const regex = new RegExp(String(query.search).trim(), "i");
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { company: regex },
      { designation: regex },
    ];
  }

  const sortOrder = parseSortParam(query.sort);
  const docs = await Contact.find(filter).sort(sortOrder);

  const headers = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "designation",
    "tags",
    "notes",
  ];

  const rows = docs.map((c) => [
    c.firstName || "",
    c.lastName || "",
    c.email || "",
    c.phone || "",
    c.company || "",
    c.designation || "",
    (c.tags || []).join(";"),
    c.notes || "",
  ]);

  return generateCSV(headers, rows);
}

// Server-side CSV Import with row-level validation and error reporting
async function importContactsCSV(userId, csvText) {
  const uId = String(userId);
  const parsedRows = parseCSV(csvText);

  if (parsedRows.length === 0) {
    throw httpError(400, "No valid data rows found in CSV.");
  }

  const errors = [];
  const contactsToInsert = [];

  // Pre-load existing active emails and phones to prevent duplicates
  const existingContacts = await Contact.find(
    { userId: uId, isDeleted: false },
    { email: 1, phone: 1 }
  );
  const existingEmails = new Set(
    existingContacts.map((c) => (c.email || "").toLowerCase()).filter(Boolean)
  );
  const existingPhones = new Set(
    existingContacts.map((c) => (c.phone || "").trim()).filter(Boolean)
  );

  for (const { rowNumber, data } of parsedRows) {
    const firstName = data.firstname || data["first name"] || data.first_name || "";
    const lastName = data.lastname || data["last name"] || data.last_name || "";
    const email = (data.email || "").trim().toLowerCase();
    const phone = (data.phone || "").trim();
    const company = data.company || "";
    const designation = data.designation || data.role || "";
    const rawTags = data.tags || data.tag || "";
    const tags = rawTags
      ? rawTags.split(/[;,]/).map((t) => t.trim()).filter(Boolean)
      : ["Imported"];
    const notes = data.notes || data.note || "Imported via CSV";

    if (!firstName.trim()) {
      errors.push({ row: rowNumber, error: "First name is required." });
      continue;
    }

    if (email && existingEmails.has(email)) {
      errors.push({ row: rowNumber, error: `Email "${email}" is already used by an existing contact.` });
      continue;
    }

    if (phone && existingPhones.has(phone)) {
      errors.push({ row: rowNumber, error: `Phone "${phone}" is already used by an existing contact.` });
      continue;
    }

    if (email) existingEmails.add(email);
    if (phone) existingPhones.add(phone);

    contactsToInsert.push({
      userId: uId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone,
      company: company.trim(),
      designation: designation.trim(),
      tags,
      notes: notes.trim(),
      isDeleted: false,
      deletedAt: null,
      isFavorite: false,
      followUpDate: null,
    });
  }

  let importedCount = 0;
  if (contactsToInsert.length > 0) {
    const inserted = await Contact.insertMany(contactsToInsert);
    importedCount = inserted.length;
  }

  return {
    totalRows: parsedRows.length,
    importedCount,
    failedCount: errors.length,
    errors,
  };
}

// Only the admin can reset to default demo contacts.
async function resetDemoContacts(userId, isAdmin) {
  if (!isAdmin) {
    throw httpError(403, "Only the demo admin can restore sample contacts.");
  }
  const uId = String(userId);

  // Clear existing records for this user
  await Contact.deleteMany({ userId: uId });
  await ContactList.deleteMany({ userId: uId });
  await FollowUp.deleteMany({ userId: uId });
  await Interaction.deleteMany({ userId: uId });

  const rawContacts = sampleContacts();
  const contactsWithUser = rawContacts.map((c) => ({
    ...c,
    _id: c.id,
    userId: uId,
  }));
  const savedContacts = await Contact.insertMany(contactsWithUser);

  const rawLists = sampleLists(savedContacts, uId);
  if (rawLists.length > 0) {
    await ContactList.insertMany(
      rawLists.map((l) => ({ ...l, _id: l.id, userId: uId }))
    );
  }

  const rawFollowUps = sampleFollowUps(savedContacts, uId);
  if (rawFollowUps.length > 0) {
    await FollowUp.insertMany(
      rawFollowUps.map((f) => ({ ...f, _id: f.id, userId: uId }))
    );
  }

  const rawInteractions = sampleInteractions(savedContacts, uId);
  if (rawInteractions.length > 0) {
    await Interaction.insertMany(
      rawInteractions.map((i) => ({ ...i, _id: i.id, userId: uId }))
    );
  }

  return savedContacts.map(formatDoc);
}

module.exports = {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  softDeleteContact,
  restoreContact,
  toggleFavorite,
  permanentDeleteContact,
  resetDemoContacts,
  exportContactsCSV,
  importContactsCSV,
};
