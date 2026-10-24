import { request } from "./client.js";

// Gets ALL contacts of the logged-in user (active and deleted).
// The server gives 100 at a time, so we ask page by page.
export async function getAllContacts() {
  let all = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const { data } = await request(
      `/contacts?status=all&limit=100&page=${page}`,
    );
    all = all.concat(data.contacts);
    hasNext = data.pagination.hasNextPage;
    page += 1;
  }
  return all;
}

export async function createContact(contact) {
  const { data } = await request("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
  return data.contact;
}

export function updateContact(id, changes) {
  return request(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

export function deleteContact(id) {
  return request(`/contacts/${id}`, { method: "DELETE" });
}

export function restoreContact(id) {
  return request(`/contacts/${id}/restore`, { method: "PATCH" });
}

export function toggleFavorite(id) {
  return request(`/contacts/${id}/favorite`, { method: "PATCH" });
}

export function permanentDeleteContact(id) {
  return request(`/contacts/${id}/permanent`, { method: "DELETE" });
}

export function resetDemoContacts() {
  return request("/contacts/demo/reset", { method: "POST" });
}
