import { supabase } from "../config/supabase.js";
import { DEMO_USER_ID } from "../config/constants.js";

// Validate the fields a goal needs. Returns an error string or null.
function validateGoal({ name, target_amount, current_amount }) {
  if (!name || typeof name !== "string") return "Name is required";
  if (target_amount === undefined || isNaN(Number(target_amount)) || Number(target_amount) <= 0)
    return "Target amount must be a number greater than 0";
  if (current_amount !== undefined && (isNaN(Number(current_amount)) || Number(current_amount) < 0))
    return "Current amount must be a number of 0 or more";
  return null;
}

// GET /api/goals
export async function getGoals(req, res) {
  try {
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("getGoals error:", err.message);
    res.status(500).json({ error: "Failed to load goals" });
  }
}

// POST /api/goals
export async function createGoal(req, res) {
  try {
    const validationError = validateGoal(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { name, target_amount, current_amount } = req.body;

    const { data, error } = await supabase
      .from("financial_goals")
      .insert({
        user_id: DEMO_USER_ID,
        name,
        target_amount: Number(target_amount),
        current_amount: Number(current_amount) || 0,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("createGoal error:", err.message);
    res.status(500).json({ error: "Failed to create goal" });
  }
}

// PUT /api/goals/:id
export async function updateGoal(req, res) {
  try {
    const validationError = validateGoal(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { id } = req.params;
    const { name, target_amount, current_amount } = req.body;

    const { data, error } = await supabase
      .from("financial_goals")
      .update({
        name,
        target_amount: Number(target_amount),
        current_amount: Number(current_amount) || 0,
      })
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Goal not found" });

    res.json(data);
  } catch (err) {
    console.error("updateGoal error:", err.message);
    res.status(500).json({ error: "Failed to update goal" });
  }
}

// DELETE /api/goals/:id
export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("financial_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", DEMO_USER_ID);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error("deleteGoal error:", err.message);
    res.status(500).json({ error: "Failed to delete goal" });
  }
}
