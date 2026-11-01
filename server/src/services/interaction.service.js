const Interaction = require("../models/Interaction");
const Contact = require("../models/Contact");
const httpError = require("../utils/httpError");

function formatInteraction(item, contactName = "") {
  const obj = item.toObject ? item.toObject() : { ...item };
  return {
    id: String(obj._id || obj.id),
    userId: String(obj.userId),
    contactId: String(obj.contactId),
    contactName: contactName || obj.contactName || "Contact",
    type: obj.type,
    title: obj.title || "",
    note: obj.note,
    date: obj.date ? new Date(obj.date).toISOString() : new Date().toISOString(),
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : new Date().toISOString(),
  };
}

async function verifyContactBelongsToUser(userId, contactId) {
  const contact = await Contact.findOne({ _id: contactId, userId: String(userId) });
  if (!contact) {
    throw httpError(404, "Contact not found for this user.");
  }
  return contact;
}

async function getInteractionsByContact(userId, contactId) {
  const contact = await verifyContactBelongsToUser(userId, contactId);
  const contactName = `${contact.firstName} ${contact.lastName || ""}`.trim();

  const items = await Interaction.find({
    userId: String(userId),
    contactId: String(contactId),
  }).sort({ date: -1, createdAt: -1 });

  return items.map((i) => formatInteraction(i, contactName));
}

async function getRecentInteractions(userId, limit = 10) {
  const uId = String(userId);
  const items = await Interaction.find({ userId: uId })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit);

  const contacts = await Contact.find({ userId: uId });
  const contactNameMap = {};
  contacts.forEach((c) => {
    contactNameMap[String(c._id || c.id)] = `${c.firstName} ${c.lastName || ""}`.trim();
  });

  return items.map((item) =>
    formatInteraction(item, contactNameMap[String(item.contactId)])
  );
}

async function createInteraction(userId, payload) {
  const uId = String(userId);
  const { contactId, type, title, date } = payload;
  const note = String(payload.note || payload.summary || payload.description || "").trim();

  if (!contactId) throw httpError(400, "Contact ID is required.");
  if (!type || !["call", "email", "meeting", "note"].includes(type)) {
    throw httpError(400, "Valid interaction type (call, email, meeting, note) is required.");
  }
  if (!note) {
    throw httpError(400, "Interaction note / remarks cannot be empty.");
  }

  const contact = await verifyContactBelongsToUser(uId, contactId);
  const contactName = `${contact.firstName} ${contact.lastName || ""}`.trim();

  let interactionDate = new Date();
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      interactionDate = parsed;
    }
  }

  const created = await Interaction.create({
    userId: uId,
    contactId: String(contactId),
    type,
    title: (title || payload.subject || "").trim() || `${type.charAt(0).toUpperCase() + type.slice(1)} Log`,
    note,
    date: interactionDate,
  });

  return formatInteraction(created, contactName);
}

async function deleteInteraction(userId, interactionId) {
  const uId = String(userId);
  const removed = await Interaction.findOneAndDelete({ _id: interactionId, userId: uId });
  if (!removed) throw httpError(404, "Interaction not found.");
  return formatInteraction(removed);
}

module.exports = {
  getInteractionsByContact,
  getRecentInteractions,
  createInteraction,
  deleteInteraction,
};
