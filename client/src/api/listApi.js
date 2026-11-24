import { request } from "./client.js";

export async function getAllLists() {
  const { data } = await request("/lists");
  return data.lists || [];
}

export async function getListById(id) {
  const { data } = await request(`/lists/${id}`);
  return data.list;
}

export async function createList(payload) {
  const { data } = await request("/lists", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.list;
}

export async function updateList(id, payload) {
  const { data } = await request(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.list;
}

export async function deleteList(id) {
  const { data } = await request(`/lists/${id}`, {
    method: "DELETE",
  });
  return data.list;
}

export async function addContactsToList(listId, contactIds) {
  const { data } = await request(`/lists/${listId}/contacts`, {
    method: "POST",
    body: JSON.stringify({ contactIds }),
  });
  return data.list;
}

export async function removeContactFromList(listId, contactId) {
  const { data } = await request(`/lists/${listId}/contacts/${contactId}`, {
    method: "DELETE",
  });
  return data.list;
}

export async function getListsForContact(contactId) {
  const { data } = await request(`/lists/contact/${contactId}`);
  return data.lists || [];
}

