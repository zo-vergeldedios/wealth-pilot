import { supabase } from "../config/supabase.js";
import { DEMO_USER_ID } from "../config/constants.js";

// GET /api/profile
// Returns the single profile row for the demo user.
export async function getProfile(req, res) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("getProfile error:", err.message);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

// PUT /api/profile
// Updates the demo user's financial figures.
export async function updateProfile(req, res) {
  try {
    const { income, net_worth, investments, debt } = req.body;

    // Only allow the four numeric fields to be updated.
    const updates = { income, net_worth, investments, debt };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", DEMO_USER_ID)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("updateProfile error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
}
