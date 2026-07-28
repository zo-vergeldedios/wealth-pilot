import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import expenseRoutes from "./routes/expenses.js";
import incomeRoutes from "./routes/income.js";
import goalRoutes from "./routes/goals.js";
import { requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow the frontend (Vercel in prod, Vite dev server locally) to call the API.
app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:5173",
    origin: "*",
  }),
);

// Parse JSON request bodies.
app.use(express.json());

// Simple health check — handy for Render and for confirming the API is up.
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "WealthPilot API" });
});

// Auth routes are public — this is where a browser gets its token.
app.use("/api/auth", authRoutes);

// Every feature route is private: requireAuth runs first, identifies the user
// from their token, and attaches it as req.user. The controllers then filter
// all data by req.user.id, so each user only ever touches their own rows.
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/expenses", requireAuth, expenseRoutes);
app.use("/api/income", requireAuth, incomeRoutes);
app.use("/api/goals", requireAuth, goalRoutes);

app.listen(PORT, () => {
  console.log(`WealthPilot API running on port ${PORT}`);
});
