import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Fail fast on startup instead of getting confusing errors on every request.
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Check your server/.env file."
  );
}

// A single shared Supabase client for the whole API.
export const supabase = createClient(supabaseUrl, supabaseKey);
