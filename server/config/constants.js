// Central place for shared constants.

// This MVP uses a single demo user instead of full authentication.
// Every row is tied to this fixed id. Swapping in real auth later just means
// replacing this constant with the id from the logged-in user's session.
export const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

// The fixed set of categories an expense can belong to. Keeping this on the
// server lets both validation and the frontend share one source of truth.
export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Other",
];

// The fixed set of sources an income entry can belong to. Same pattern as
// EXPENSE_CATEGORIES: one server-side source of truth shared by validation
// and the frontend dropdowns.
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];
