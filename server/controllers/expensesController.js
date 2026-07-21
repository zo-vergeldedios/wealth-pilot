import { supabase } from "../config/supabase.js";
import { DEMO_USER_ID, EXPENSE_CATEGORIES } from "../config/constants.js";

// Small helper to validate the fields an expense needs.
// Returns an error message string, or null if everything is valid.
function validateExpense({ name, amount, category, date }) {
  if (!name || typeof name !== "string") return "Name is required";
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0)
    return "Amount must be a number greater than 0";
  if (!EXPENSE_CATEGORIES.includes(category))
    return `Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`;
  if (!date) return "Date is required";
  return null;
}

// GET /api/expenses
// All expenses for the demo user, newest first.
export async function getExpenses(req, res) {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("getExpenses error:", err.message);
    res.status(500).json({ error: "Failed to load expenses" });
  }
}

// POST /api/expenses
export async function createExpense(req, res) {
  try {
    const validationError = validateExpense(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { name, amount, category, date } = req.body;

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: DEMO_USER_ID,
        name,
        amount: Number(amount),
        category,
        date,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("createExpense error:", err.message);
    res.status(500).json({ error: "Failed to create expense" });
  }
}

// PUT /api/expenses/:id
export async function updateExpense(req, res) {
  try {
    const validationError = validateExpense(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { id } = req.params;
    const { name, amount, category, date } = req.body;

    const { data, error } = await supabase
      .from("expenses")
      .update({ name, amount: Number(amount), category, date })
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID) // never let one user edit another's row
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Expense not found" });

    res.json(data);
  } catch (err) {
    console.error("updateExpense error:", err.message);
    res.status(500).json({ error: "Failed to update expense" });
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error("deleteExpense error:", err.message);
    res.status(500).json({ error: "Failed to delete expense" });
  }
}
