const crypto = require("crypto");
const { getInteractionMap, saveInteractionMap, getContactMap } = require("../config/db");
const httpError = require("../utils/httpError");

function getMyInteractions(userId) {
  return getInteractionMap()[userId] || [];
}

function saveMyInteractions(userId, list) {
  const map = getInteractionMap();
  map[userId] = list;
  saveInteractionMap(map);
}

function verifyContactBelongsToUser(userId, contactId) {
  const userContacts = (getContactMap()[userId] || []);
  const contact = userContacts.find((c) => c.id === contactId);
  if (!contact) {
    throw httpError(404, "Contact not found for this user.");
  }
  return contact;
}

function getInteractionsByContact(userId, contactId) {
  verifyContactBelongsToUser(userId, contactId);
  const list = getMyInteractions(userId);
  return list
    .filter((item) => item.contactId === contactId)
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

function getRecentInteractions(userId, limit = 10) {
  const list = getMyInteractions(userId);
  const userContacts = (getContactMap()[userId] || []);
  const contactNameMap = {};
  userContacts.forEach((c) => {
    contactNameMap[c.id] = `${c.firstName} ${c.lastName || ""}`.trim();
  });

  return list
    .map((item) => ({
      ...item,
      contactName: contactNameMap[item.contactId] || item.contactName || "Contact",
    }))
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, limit);
}

function createInteraction(userId, payload) {
  const { contactId, type, title, date } = payload;
  const note = String(payload.note || payload.summary || payload.description || "").trim();
  if (!contactId) throw httpError(400, "Contact ID is required.");
  if (!type || !["call", "email", "meeting", "note"].includes(type)) {
    throw httpError(400, "Valid interaction type (call, email, meeting, note) is required.");
  }
  if (!note) {
    throw httpError(400, "Interaction note / remarks cannot be empty.");
  }

  const contact = verifyContactBelongsToUser(userId, contactId);

  const now = new Date().toISOString();
  let interactionDate = now;
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      interactionDate = parsed.toISOString();
    }
  }

  const interaction = {
    id: crypto.randomUUID(),
    userId,
    contactId,
    contactName: `${contact.firstName} ${contact.lastName || ""}`.trim(),
    type,
    title: (title || payload.subject || "").trim() || `${type.charAt(0).toUpperCase() + type.slice(1)} Log`,
    note,
    date: interactionDate,
    createdAt: now,
  };

  const list = getMyInteractions(userId);
  list.unshift(interaction);
  saveMyInteractions(userId, list);

  return interaction;
}

function deleteInteraction(userId, interactionId) {
  const list = getMyInteractions(userId);
  const index = list.findIndex((i) => i.id === interactionId);
  if (index === -1) {
    throw httpError(404, "Interaction not found.");
  }
  const removed = list.splice(index, 1)[0];
  saveMyInteractions(userId, list);
  return removed;
}

module.exports = {
  getInteractionsByContact,
  getRecentInteractions,
  createInteraction,
  deleteInteraction,
};
