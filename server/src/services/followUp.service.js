const crypto = require("crypto");
const { getFollowUpMap, saveFollowUpMap, getContactMap, saveContactMap } = require("../config/db");
const httpError = require("../utils/httpError");

function getMyFollowUps(userId) {
  return getFollowUpMap()[userId] || [];
}

function saveMyFollowUps(userId, list) {
  const map = getFollowUpMap();
  map[userId] = list;
  saveFollowUpMap(map);
}

function getContact(userId, contactId) {
  const contacts = getContactMap()[userId] || [];
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) throw httpError(404, "Contact not found for this user.");
  return contact;
}

function computeDiffDays(dueDateStr) {
  if (!dueDateStr) return null;
  const target = new Date(dueDateStr);
  if (isNaN(target.getTime())) return null;
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function enrichFollowUp(userId, item) {
  const userContacts = getContactMap()[userId] || [];
  const contact = userContacts.find((c) => c.id === item.contactId) || {};
  const diffDays = computeDiffDays(item.dueDate);
  let timeCategory = "upcoming";
  if (diffDays !== null) {
    if (diffDays < 0) timeCategory = "overdue";
    else if (diffDays === 0) timeCategory = "today";
  }

  return {
    ...item,
    contactName: `${contact.firstName || "Unknown"} ${contact.lastName || ""}`.trim(),
    contactCompany: contact.company || "",
    contactEmail: contact.email || "",
    contactPhone: contact.phone || "",
    isContactDeleted: Boolean(contact.isDeleted),
    diffDays,
    timeCategory,
  };
}

function getAllFollowUps(userId, query = {}) {
  const list = getMyFollowUps(userId);
  let enriched = list.map((item) => enrichFollowUp(userId, item));

  // Filter out follow-ups whose contacts have been permanently deleted, unless requested
  if (query.includeDeleted !== "true") {
    enriched = enriched.filter((item) => !item.isContactDeleted);
  }

  if (query.contactId) {
    enriched = enriched.filter((item) => item.contactId === query.contactId);
  }

  if (query.status && query.status !== "all") {
    enriched = enriched.filter((item) => item.status === query.status);
  }

  if (query.priority && query.priority !== "all") {
    enriched = enriched.filter((item) => item.priority === query.priority);
  }

  if (query.category && query.category !== "all") {
    enriched = enriched.filter((item) => item.timeCategory === query.category);
  }

  // Sort: pending first by dueDate ascending, completed by completedAt descending
  enriched.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "pending" ? -1 : 1;
    }
    if (a.status === "pending") {
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    }
    return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
  });

  return enriched;
}

function createFollowUp(userId, payload) {
  const { contactId, dueDate, priority = "medium" } = payload;
  const description = String(payload.description || payload.title || "").trim();
  if (!contactId) throw httpError(400, "Contact ID is required.");
  if (!description) {
    throw httpError(400, "Follow-up description is required.");
  }
  if (!dueDate) throw httpError(400, "Follow-up due date is required.");

  const contact = getContact(userId, contactId);

  const now = new Date().toISOString();
  const followUp = {
    id: crypto.randomUUID(),
    userId,
    contactId,
    description,
    dueDate: String(dueDate).trim().split("T")[0],
    priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
    status: "pending",
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const list = getMyFollowUps(userId);
  list.push(followUp);
  saveMyFollowUps(userId, list);

  // Sync with contact.followUpDate if not set or this is sooner
  if (!contact.followUpDate || contact.followUpDate > followUp.dueDate) {
    const contactMap = getContactMap();
    const c = (contactMap[userId] || []).find((x) => x.id === contactId);
    if (c) {
      c.followUpDate = followUp.dueDate;
      c.updatedAt = now;
      saveContactMap(contactMap);
    }
  }

  return enrichFollowUp(userId, followUp);
}

function updateFollowUp(userId, id, payload) {
  const list = getMyFollowUps(userId);
  const item = list.find((f) => f.id === id);
  if (!item) throw httpError(404, "Follow-up not found.");

  if (payload.description !== undefined || payload.title !== undefined) {
    item.description = String(payload.description || payload.title || "").trim();
  }
  if (payload.dueDate !== undefined) {
    item.dueDate = String(payload.dueDate).trim().split("T")[0];
  }
  if (payload.priority !== undefined && ["low", "medium", "high"].includes(payload.priority)) {
    item.priority = payload.priority;
  }
  if (payload.status !== undefined && ["pending", "completed"].includes(payload.status)) {
    item.status = payload.status;
    item.completedAt = payload.status === "completed" ? new Date().toISOString() : null;
  }

  item.updatedAt = new Date().toISOString();
  saveMyFollowUps(userId, list);
  return enrichFollowUp(userId, item);
}

function toggleFollowUpStatus(userId, id) {
  const list = getMyFollowUps(userId);
  const item = list.find((f) => f.id === id);
  if (!item) throw httpError(404, "Follow-up not found.");

  const isNowCompleted = item.status !== "completed";
  item.status = isNowCompleted ? "completed" : "pending";
  item.completedAt = isNowCompleted ? new Date().toISOString() : null;
  item.updatedAt = new Date().toISOString();

  saveMyFollowUps(userId, list);
  return enrichFollowUp(userId, item);
}

function deleteFollowUp(userId, id) {
  const list = getMyFollowUps(userId);
  const index = list.findIndex((f) => f.id === id);
  if (index === -1) throw httpError(404, "Follow-up not found.");

  const removed = list.splice(index, 1)[0];
  saveMyFollowUps(userId, list);
  return removed;
}

module.exports = {
  getAllFollowUps,
  createFollowUp,
  updateFollowUp,
  toggleFollowUpStatus,
  deleteFollowUp,
};
