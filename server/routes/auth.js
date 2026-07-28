import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: no token needed to sign up or log in.
router.post("/signup", signup);
router.post("/login", login);

// Protected: needs a valid token so we can identify the current user.
router.get("/me", requireAuth, me);

export default router;
