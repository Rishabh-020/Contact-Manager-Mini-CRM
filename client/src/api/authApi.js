import { request } from "./client.js";

// Saves the token and the user in localStorage after login or register.
function saveLogin(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("cm_user", JSON.stringify(data.user));
  return data.user;
}

export async function register(name, email, password) {
  const { data } = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return saveLogin(data);
}

export async function login(email, password) {
  const { data } = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return saveLogin(data);
}

// Reads the user saved in the browser (no server call).
export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("cm_user")) || null;
  } catch {
    return null;
  }
}

// Asks the server if the saved token is still valid.
// Returns the user, or null if the user must log in again.
export async function checkLogin() {
  if (!localStorage.getItem("token")) return null;
  try {
    const { data } = await request("/auth/me");
    localStorage.setItem("cm_user", JSON.stringify(data.user));
    return data.user;
  } catch {
    logout();
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("cm_user");
}
