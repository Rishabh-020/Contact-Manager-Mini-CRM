const Contact = require("../models/Contact");
const FollowUp = require("../models/FollowUp");
const Interaction = require("../models/Interaction");
const ContactList = require("../models/ContactList");
const httpError = require("../utils/httpError");
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
  ["firstName", "lastName", "company", "designation", "notes"].forEach((key) => {
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

  const total = await Contact.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  const docs = await Contact.find(filter)
    .sort({ createdAt: -1 })
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

  if (clean.email) {
    const taken = await Contact.findOne({
      userId: String(userId),
      email: clean.email,
      isDeleted: false,
    });
    if (taken) throw httpError(409, "A contact with this email already exists.");
  }

  const created = await Contact.create({
    ...clean,
    userId: String(userId),
    isDeleted: false,
    deletedAt: null,
  });

  return formatDoc(created);
}

async function updateContact(userId, id, body) {
  const contact = await Contact.findOne({ _id: id, userId: String(userId) });
  if (!contact) throw httpError(404, "Contact not found.");

  const clean = cleanFields(pickFields(body));
  if (clean.firstName !== undefined && !clean.firstName) {
    throw httpError(400, "First name cannot be empty.");
  }

  if (clean.email && clean.email !== contact.email) {
    const taken = await Contact.findOne({
      userId: String(userId),
      _id: { $ne: id },
      email: clean.email,
      isDeleted: false,
    });
    if (taken) throw httpError(409, "A contact with this email already exists.");
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
};
