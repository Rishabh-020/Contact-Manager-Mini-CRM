import { request } from "./client.js";

export async function getContactInteractions(contactId) {
  const { data } = await request(`/interactions/contact/${contactId}`);
  return data.interactions || [];
}

export async function getRecentInteractions(limit = 10) {
  const { data } = await request(`/interactions/recent?limit=${limit}`);
  return data.interactions || [];
}

export async function createInteraction(payload) {
  const { data } = await request("/interactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.interaction;
}

export async function deleteInteraction(id) {
  const { data } = await request(`/interactions/${id}`, {
    method: "DELETE",
  });
  return data.interaction;
}

