import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./routes/profile.js";
import expenseRoutes from "./routes/expenses.js";
import goalRoutes from "./routes/goals.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow the frontend (Vercel in prod, Vite dev server locally) to call the API.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Parse JSON request bodies.
app.use(express.json());

// Simple health check — handy for Render and for confirming the API is up.
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "WealthPilot API" });
});

// Feature routes.
app.use("/api/profile", profileRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/goals", goalRoutes);

app.listen(PORT, () => {
  console.log(`WealthPilot API running on port ${PORT}`);
});
