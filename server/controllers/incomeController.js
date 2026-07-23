import { supabase } from "../config/supabase.js";
import { DEMO_USER_ID, INCOME_CATEGORIES } from "../config/constants.js";

// Small helper to validate the fields an income entry needs.
// Returns an error message string, or null if everything is valid.
function validateIncome({ source, amount, category, date }) {
  if (!source || typeof source !== "string") return "Source is required";
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0)
    return "Amount must be a number greater than 0";
  if (!INCOME_CATEGORIES.includes(category))
    return `Category must be one of: ${INCOME_CATEGORIES.join(", ")}`;
  if (!date) return "Date is required";
  return null;
}

// GET /api/income
// All income entries for the demo user, newest first.
export async function getIncome(req, res) {
  try {
    const { data, error } = await supabase
      .from("income")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("getIncome error:", err.message);
    res.status(500).json({ error: "Failed to load income" });
  }
}

// POST /api/income
export async function createIncome(req, res) {
  try {
    const validationError = validateIncome(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { source, amount, category, date } = req.body;

    const { data, error } = await supabase
      .from("income")
      .insert({
        user_id: DEMO_USER_ID,
        source,
        amount: Number(amount),
        category,
        date,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("createIncome error:", err.message);
    res.status(500).json({ error: "Failed to create income" });
  }
}

// PUT /api/income/:id
export async function updateIncome(req, res) {
  try {
    const validationError = validateIncome(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { id } = req.params;
    const { source, amount, category, date } = req.body;

    const { data, error } = await supabase
      .from("income")
      .update({ source, amount: Number(amount), category, date })
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID) // never let one user edit another's row
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Income not found" });

    res.json(data);
  } catch (err) {
    console.error("updateIncome error:", err.message);
    res.status(500).json({ error: "Failed to update income" });
  }
}

// DELETE /api/income/:id
export async function deleteIncome(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("income")
      .delete()
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error("deleteIncome error:", err.message);
    res.status(500).json({ error: "Failed to delete income" });
  }
}
