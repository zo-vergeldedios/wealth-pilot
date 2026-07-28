// Authentication service.
// ------------------------
// The whole auth model for this MVP: a user has a random token, we keep it in
// localStorage, and we send it on every API request. There are no passwords.
//
// This file owns two concerns, both auth-specific and kept out of the general
// api.js data layer:
//   1. Storing / reading / clearing the token in the browser.
//   2. The signup, login, and "who am I" API calls.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// One key name, in one place, so storage never drifts out of sync.
const TOKEN_KEY = "wealthpilot_token";

// ---- Token storage (localStorage) ----
// localStorage keeps the token across page reloads, which is what lets a user
// stay logged in until they explicitly log out.
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Small POST helper for the two public auth endpoints.
async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

// Signup / login both return the user record, including its user_token.
export const signupRequest = (username) =>
  postJson("/api/auth/signup", { username });
export const loginRequest = (username) =>
  postJson("/api/auth/login", { username });

// Restore a session on page load: given the stored token, ask the API who it
// belongs to. Returns the user, or null if there is no valid token.
export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null; // stale / invalid token — treat as logged out
  return res.json();
}
