// Small formatting helpers shared across pages.

// The expense categories, mirrored from the server. Used to populate dropdowns.
export const CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Other",
];

// One fixed color per category so a category is always the same hue across
// every chart. These are a colorblind-safe categorical palette (assigned in
// fixed order, never cycled) — identity is also reinforced by axis labels and
// legends, so color is never the only signal.
export const CATEGORY_COLORS = {
  Housing: "#4a9fe8", // blue
  Food: "#f0803c", // orange
  Transportation: "#2fc79a", // aqua
  Entertainment: "#f2b53c", // yellow
  Healthcare: "#ef92b6", // magenta
  Other: "#8a8d86", // gray
};

// The income sources, mirrored from the server. Used to populate dropdowns.
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];

// A green-leaning palette for income, keeping the dashboard's green identity.
// Like CATEGORY_COLORS these are assigned in fixed order and reinforced by
// labels/legends, so color is never the only signal.
export const INCOME_CATEGORY_COLORS = {
  Salary: "#33b074", // brand green
  Freelance: "#4ec3a0", // teal
  Investment: "#7bc86c", // light green
  Business: "#2a9d8f", // deep teal
  Gift: "#a3d977", // lime
  Other: "#8a8d86", // gray
};

// Format a number as US dollars, e.g. 125000 -> "$125,000".
export function formatCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// Format a date string (YYYY-MM-DD) as "Jul 21, 2026".
export function formatDate(value) {
  if (!value) return "";
  // Add T00:00 so the date isn't shifted by the local timezone.
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
