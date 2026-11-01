const ContactList = require("../models/ContactList");
const Contact = require("../models/Contact");
const httpError = require("../utils/httpError");

function formatList(doc, contactMap = {}) {
  const list = doc.toObject ? doc.toObject() : { ...doc };
  const rawIds = (list.contactIds || []).map((id) => String(id));
  const validContactIds = rawIds.filter((id) => Boolean(contactMap[id]));

  const memberPreviews = validContactIds.slice(0, 5).map((id) => {
    const c = contactMap[id] || {};
    return {
      id,
      name: `${c.firstName || "Contact"} ${c.lastName || ""}`.trim(),
      email: c.email || "",
      company: c.company || "",
    };
  });

  return {
    id: String(list._id || list.id),
    userId: String(list.userId),
    name: list.name,
    description: list.description || "",
    color: list.color || "blue",
    contactIds: validContactIds,
    contactsCount: validContactIds.length,
    memberPreviews,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}

async function getAllLists(userId) {
  const uId = String(userId);
  const lists = await ContactList.find({ userId: uId }).sort({ createdAt: -1 });
  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });

  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return lists.map((l) => formatList(l, contactMap));
}

async function getListById(userId, listId) {
  const uId = String(userId);
  const list = await ContactList.findOne({ _id: listId, userId: uId });
  if (!list) throw httpError(404, "List not found.");

  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return formatList(list, contactMap);
}

async function createList(userId, payload) {
  const uId = String(userId);
  const { name, description = "", color = "blue", contactIds = [] } = payload;
  if (!name || !name.trim()) {
    throw httpError(400, "List name is required.");
  }

  const cleanIds = (contactIds || []).map((id) => String(id).trim()).filter(Boolean);

  const created = await ContactList.create({
    userId: uId,
    name: name.trim(),
    description: (description || "").trim(),
    color: color || "blue",
    contactIds: cleanIds,
  });

  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return formatList(created, contactMap);
}

async function updateList(userId, listId, payload) {
  const uId = String(userId);
  const list = await ContactList.findOne({ _id: listId, userId: uId });
  if (!list) throw httpError(404, "List not found.");

  if (payload.name !== undefined) {
    if (!payload.name.trim()) throw httpError(400, "List name cannot be empty.");
    list.name = payload.name.trim();
  }
  if (payload.description !== undefined) {
    list.description = String(payload.description).trim();
  }
  if (payload.color !== undefined) {
    list.color = payload.color;
  }
  if (payload.contactIds !== undefined && Array.isArray(payload.contactIds)) {
    list.contactIds = payload.contactIds.map((id) => String(id).trim()).filter(Boolean);
  }

  await list.save();

  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return formatList(list, contactMap);
}

async function deleteList(userId, listId) {
  const uId = String(userId);
  const removed = await ContactList.findOneAndDelete({ _id: listId, userId: uId });
  if (!removed) throw httpError(404, "List not found.");
  return { id: String(removed._id || removed.id), name: removed.name };
}

async function addContactsToList(userId, listId, contactIds) {
  const uId = String(userId);
  const list = await ContactList.findOne({ _id: listId, userId: uId });
  if (!list) throw httpError(404, "List not found.");

  const currentIds = new Set((list.contactIds || []).map((id) => String(id)));
  (contactIds || []).forEach((id) => {
    if (id) currentIds.add(String(id).trim());
  });

  list.contactIds = Array.from(currentIds);
  await list.save();

  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return formatList(list, contactMap);
}

async function removeContactFromList(userId, listId, contactId) {
  const uId = String(userId);
  const list = await ContactList.findOne({ _id: listId, userId: uId });
  if (!list) throw httpError(404, "List not found.");

  list.contactIds = (list.contactIds || []).filter((id) => String(id) !== String(contactId));
  await list.save();

  const activeContacts = await Contact.find({ userId: uId, isDeleted: false });
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[String(c._id || c.id)] = c;
  });

  return formatList(list, contactMap);
}

async function getListsForContact(userId, contactId) {
  const uId = String(userId);
  const cId = String(contactId);
  const lists = await ContactList.find({ userId: uId, contactIds: cId });
  return lists.map((l) => ({
    id: String(l._id || l.id),
    name: l.name,
    color: l.color,
  }));
}

module.exports = {
  getAllLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addContactsToList,
  removeContactFromList,
  getListsForContact,
};
