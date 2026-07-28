import { supabase } from "../config/supabase.js";

// ============================================================
// Authentication middleware
// ============================================================
//
// How user tokens work
// ---------------------
// At signup the database generates a random `user_token` for the user and we
// hand it to the browser, which stores it (localStorage) and sends it back on
// every request in the header:
//
//     Authorization: Bearer <user_token>
//
// This middleware is the single place that turns that token back into a user:
//   1. Read the token from the Authorization header.
//   2. Look up the user row that owns that token.
//   3. Attach that user to `req.user`.
//
// How data ownership is enforced
// -------------------------------
// Controllers NEVER trust a user_id sent by the browser. They always read the
// owner from `req.user.id` (set here) and filter every query by it. Combined
// with the random, unguessable token, that means a request can only ever touch
// the data belonging to whoever the token identifies — one user can never see
// or change another user's rows.
//
// Reuse: attach this to any route group that must be private (see index.js).
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

    if (!token) {
      return res.status(401).json({ error: "Not signed in" });
    }

    // Map the token back to its owner. .maybeSingle() returns null (rather than
    // erroring) when the token matches no user, e.g. after logout on another
    // device or a stale token.
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username")
      .eq("user_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // Everything downstream now knows who is making the request.
    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err.message);
    res.status(401).json({ error: "Invalid session" });
  }
}
