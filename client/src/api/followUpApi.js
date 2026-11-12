import { request } from "./client.js";

export async function getAllFollowUps(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/follow-ups?${query}` : "/follow-ups";
  const { data } = await request(path);
  return data.followUps || [];
}

export async function createFollowUp(payload) {
  const { data } = await request("/follow-ups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.followUp;
}

export async function updateFollowUp(id, payload) {
  const { data } = await request(`/follow-ups/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.followUp;
}

export async function toggleFollowUpStatus(id) {
  const { data } = await request(`/follow-ups/${id}/status`, {
    method: "PATCH",
  });
  return data.followUp;
}

export async function deleteFollowUp(id) {
  const { data } = await request(`/follow-ups/${id}`, {
    method: "DELETE",
  });
  return data.followUp;
}

