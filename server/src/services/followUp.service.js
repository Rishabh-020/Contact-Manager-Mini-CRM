const FollowUp = require("../models/FollowUp");
const Contact = require("../models/Contact");
const httpError = require("../utils/httpError");

function computeDiffDays(dueDateStr) {
  if (!dueDateStr) return null;
  const target = new Date(dueDateStr);
  if (isNaN(target.getTime())) return null;
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function enrichItem(item, contact) {
  const c = contact || {};
  const diffDays = computeDiffDays(item.dueDate);
  let timeCategory = "upcoming";
  if (diffDays !== null) {
    if (diffDays < 0) timeCategory = "overdue";
    else if (diffDays === 0) timeCategory = "today";
  }

  return {
    id: String(item._id || item.id),
    userId: String(item.userId),
    contactId: String(item.contactId),
    description: item.description,
    dueDate: item.dueDate,
    priority: item.priority || "medium",
    status: item.status || "pending",
    completedAt: item.completedAt || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    contactName: `${c.firstName || "Unknown"} ${c.lastName || ""}`.trim(),
    contactCompany: c.company || "",
    contactEmail: c.email || "",
    contactPhone: c.phone || "",
    isContactDeleted: Boolean(c.isDeleted),
    diffDays,
    timeCategory,
  };
}

async function getAllFollowUps(userId, query = {}) {
  const uId = String(userId);
  const filter = { userId: uId };

  if (query.contactId) {
    filter.contactId = String(query.contactId);
  }
  if (query.status && query.status !== "all") {
    filter.status = query.status;
  }
  if (query.priority && query.priority !== "all") {
    filter.priority = query.priority;
  }

  const followUps = await FollowUp.find(filter);
  const contacts = await Contact.find({ userId: uId });
  const contactMap = {};
  contacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  let enriched = followUps.map((item) =>
    enrichItem(item.toObject ? item.toObject() : item, contactMap[String(item.contactId)])
  );

  // Filter out follow-ups whose contacts have been permanently deleted, unless requested
  if (query.includeDeleted !== "true") {
    enriched = enriched.filter((item) => !item.isContactDeleted);
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

async function createFollowUp(userId, payload) {
  const uId = String(userId);
  const { contactId, dueDate, priority = "medium" } = payload;
  const description = String(payload.description || payload.title || "").trim();

  if (!contactId) throw httpError(400, "Contact ID is required.");
  if (!description) throw httpError(400, "Follow-up description is required.");
  if (!dueDate) throw httpError(400, "Follow-up due date is required.");

  const contact = await Contact.findOne({ _id: contactId, userId: uId });
  if (!contact) throw httpError(404, "Contact not found for this user.");

  const created = await FollowUp.create({
    userId: uId,
    contactId: String(contactId),
    description,
    dueDate: String(dueDate).trim().split("T")[0],
    priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
    status: "pending",
    completedAt: null,
  });

  return enrichItem(created.toObject(), contact);
}

async function updateFollowUp(userId, id, payload) {
  const uId = String(userId);
  const item = await FollowUp.findOne({ _id: id, userId: uId });
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
    item.completedAt = payload.status === "completed" ? new Date() : null;
  }

  await item.save();
  const contact = await Contact.findOne({ _id: item.contactId, userId: uId });
  return enrichItem(item.toObject(), contact);
}

async function toggleFollowUpStatus(userId, id) {
  const uId = String(userId);
  const item = await FollowUp.findOne({ _id: id, userId: uId });
  if (!item) throw httpError(404, "Follow-up not found.");

  const isNowCompleted = item.status !== "completed";
  item.status = isNowCompleted ? "completed" : "pending";
  item.completedAt = isNowCompleted ? new Date() : null;

  await item.save();
  const contact = await Contact.findOne({ _id: item.contactId, userId: uId });
  return enrichItem(item.toObject(), contact);
}

async function deleteFollowUp(userId, id) {
  const uId = String(userId);
  const removed = await FollowUp.findOneAndDelete({ _id: id, userId: uId });
  if (!removed) throw httpError(404, "Follow-up not found.");
  return { id: String(removed._id), ...removed.toObject() };
}

module.exports = {
  getAllFollowUps,
  createFollowUp,
  updateFollowUp,
  toggleFollowUpStatus,
  deleteFollowUp,
};
