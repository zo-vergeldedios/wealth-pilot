import { supabase } from "../config/supabase.js";

// Validate a submitted username. Returns an error message string, or null.
function validateUsername(username) {
  if (!username || typeof username !== "string" || !username.trim())
    return "Username is required";
  if (username.trim().length < 3)
    return "Username must be at least 3 characters";
  return null;
}

// POST /api/auth/signup
// Creates a new user, gives them an empty profile, and returns their token.
// The browser stores that token and is now "logged in".
export async function signup(req, res) {
  try {
    const validationError = validateUsername(req.body.username);
    if (validationError) return res.status(400).json({ error: validationError });

    const username = req.body.username.trim();

    // Check for a duplicate up front so we can return a friendly message
    // instead of a raw unique-constraint database error.
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) return res.status(409).json({ error: "Username already taken" });

    // The database generates both the id and the user_token (see schema.sql),
    // so the token is a server-issued secret the client can never forge.
    const { data: user, error } = await supabase
      .from("users")
      .insert({ username })
      .select("id, username, user_token")
      .single();

    if (error) throw error;

    // Give the new user an empty profile row so the dashboard has something
    // to read (all figures default to 0 in the schema).
    await supabase.from("profiles").insert({ user_id: user.id });

    res.status(201).json(user);
  } catch (err) {
    console.error("signup error:", err.message);
    res.status(500).json({ error: "Failed to sign up" });
  }
}

// POST /api/auth/login
// Looks up an existing user by username and returns their token so the
// browser can store it and start making authenticated requests.
export async function login(req, res) {
  try {
    const validationError = validateUsername(req.body.username);
    if (validationError) return res.status(400).json({ error: validationError });

    const username = req.body.username.trim();

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, user_token")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: "Username not found" });

    res.json(user);
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ error: "Failed to log in" });
  }
}

// GET /api/auth/me
// Returns the current user. The frontend calls this on page load to restore a
// session from a stored token. It runs behind requireAuth, so req.user is set.
export async function me(req, res) {
  res.json(req.user);
}
