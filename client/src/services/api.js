// A thin wrapper around fetch so every component talks to the API the same way.
// One place to change the base URL, headers, or error handling.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Core request helper. Throws on a non-2xx response so callers can catch it.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // 204 No Content (delete) has no body to parse.
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// ---- Profile ----
export const getProfile = () => request("/api/profile");
export const updateProfile = (profile) =>
  request("/api/profile", { method: "PUT", body: JSON.stringify(profile) });

// ---- Expenses ----
export const getExpenses = () => request("/api/expenses");
export const createExpense = (expense) =>
  request("/api/expenses", { method: "POST", body: JSON.stringify(expense) });
export const updateExpense = (id, expense) =>
  request(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(expense) });
export const deleteExpense = (id) =>
  request(`/api/expenses/${id}`, { method: "DELETE" });

// ---- Income ----
export const getIncome = () => request("/api/income");
export const createIncome = (income) =>
  request("/api/income", { method: "POST", body: JSON.stringify(income) });
export const updateIncome = (id, income) =>
  request(`/api/income/${id}`, { method: "PUT", body: JSON.stringify(income) });
export const deleteIncome = (id) =>
  request(`/api/income/${id}`, { method: "DELETE" });

// ---- Goals ----
export const getGoals = () => request("/api/goals");
export const createGoal = (goal) =>
  request("/api/goals", { method: "POST", body: JSON.stringify(goal) });
export const updateGoal = (id, goal) =>
  request(`/api/goals/${id}`, { method: "PUT", body: JSON.stringify(goal) });
export const deleteGoal = (id) =>
  request(`/api/goals/${id}`, { method: "DELETE" });
