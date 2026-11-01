const crypto = require("crypto");
const { getListMap, saveListMap, getContactMap } = require("../config/db");
const httpError = require("../utils/httpError");

function getMyLists(userId) {
  return getListMap()[userId] || [];
}

function saveMyLists(userId, lists) {
  const map = getListMap();
  map[userId] = lists;
  saveListMap(map);
}

function getUserActiveContacts(userId) {
  const contacts = getContactMap()[userId] || [];
  return contacts.filter((c) => !c.isDeleted);
}

function getAllLists(userId) {
  const lists = getMyLists(userId);
  const activeContacts = getUserActiveContacts(userId);
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[c.id] = c;
  });

  return lists.map((list) => {
    // Only count contacts that are still active (not deleted)
    const validContactIds = (list.contactIds || []).filter((id) => Boolean(contactMap[id]));
    const memberPreviews = validContactIds.slice(0, 5).map((id) => ({
      id,
      name: `${contactMap[id].firstName} ${contactMap[id].lastName || ""}`.trim(),
      email: contactMap[id].email,
      company: contactMap[id].company,
    }));

    return {
      ...list,
      contactIds: validContactIds,
      contactsCount: validContactIds.length,
      memberPreviews,
    };
  });
}

function getListById(userId, listId) {
  const lists = getMyLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) throw httpError(404, "List not found.");

  const activeContacts = getUserActiveContacts(userId);
  const contactMap = {};
  activeContacts.forEach((c) => {
    contactMap[c.id] = c;
  });

  const validMembers = (list.contactIds || [])
    .map((id) => contactMap[id])
    .filter(Boolean);

  return {
    ...list,
    contactsCount: validMembers.length,
    contacts: validMembers,
  };
}

function createList(userId, payload) {
  const name = String(payload.name || "").trim();
  if (!name) throw httpError(400, "List name is required.");

  const lists = getMyLists(userId);
  if (lists.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
    throw httpError(409, "A list with this name already exists.");
  }

  const now = new Date().toISOString();
  const newList = {
    id: crypto.randomUUID(),
    userId,
    name,
    description: (payload.description || "").trim(),
    color: payload.color || "blue",
    contactIds: Array.isArray(payload.contactIds) ? [...new Set(payload.contactIds)] : [],
    createdAt: now,
    updatedAt: now,
  };

  lists.push(newList);
  saveMyLists(userId, lists);
  return newList;
}

function updateList(userId, listId, payload) {
  const lists = getMyLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) throw httpError(404, "List not found.");

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw httpError(400, "List name cannot be empty.");
    if (
      lists.some(
        (l) => l.id !== listId && l.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      throw httpError(409, "A list with this name already exists.");
    }
    list.name = name;
  }

  if (payload.description !== undefined) {
    list.description = String(payload.description).trim();
  }

  if (payload.color !== undefined) {
    list.color = payload.color;
  }

  list.updatedAt = new Date().toISOString();
  saveMyLists(userId, lists);
  return list;
}

function deleteList(userId, listId) {
  const lists = getMyLists(userId);
  const index = lists.findIndex((l) => l.id === listId);
  if (index === -1) throw httpError(404, "List not found.");

  const removed = lists.splice(index, 1)[0];
  saveMyLists(userId, lists);
  return removed;
}

function addContactsToList(userId, listId, contactIds) {
  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    throw httpError(400, "Array of contactIds is required.");
  }

  const lists = getMyLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) throw httpError(404, "List not found.");

  const currentSet = new Set(list.contactIds || []);
  contactIds.forEach((id) => currentSet.add(id));
  list.contactIds = Array.from(currentSet);
  list.updatedAt = new Date().toISOString();

  saveMyLists(userId, lists);
  return list;
}

function removeContactFromList(userId, listId, contactId) {
  const lists = getMyLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) throw httpError(404, "List not found.");

  list.contactIds = (list.contactIds || []).filter((id) => id !== contactId);
  list.updatedAt = new Date().toISOString();

  saveMyLists(userId, lists);
  return list;
}

function getListsForContact(userId, contactId) {
  const lists = getMyLists(userId);
  return lists
    .filter((l) => (l.contactIds || []).includes(contactId))
    .map((l) => ({ id: l.id, name: l.name, color: l.color }));
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
