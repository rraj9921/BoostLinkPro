// ─── routes/analytics.ts (replaces the inline handler) ──────────────────────
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { getOverview } from "../controllers/analytics.ts";

const r = Router();
r.get("/overview", authMiddleware, getOverview);

export default r;
