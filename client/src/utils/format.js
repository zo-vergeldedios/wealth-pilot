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
  Housing: "#2a78d6", // blue
  Food: "#eb6834", // orange
  Transportation: "#1baf7a", // aqua
  Entertainment: "#eda100", // yellow
  Healthcare: "#e87ba4", // magenta
  Other: "#008300", // green
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
