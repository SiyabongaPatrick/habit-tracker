import client from "./client";

export async function getHabits() {
  const { data } = await client.get("/habits");
  return data;
}

export async function createHabit(habit) {
  const { data } = await client.post("/habits", habit);
  return data;
}

export async function updateHabit(id, updates) {
  const { data } = await client.patch(`/habits/${id}`, updates);
  return data;
}

export async function deleteHabit(id) {
  await client.delete(`/habits/${id}`);
}

export async function toggleLog(id, logDate) {
  // logDate should be an ISO date string, e.g. "2026-07-29"
  const { data } = await client.post(`/habits/${id}/toggle`, { log_date: logDate });
  return data;
}
