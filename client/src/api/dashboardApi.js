import { request } from "./client.js";

export async function getDashboardStats() {
  const { data } = await request("/dashboard/stats");
  return data.stats;
}

