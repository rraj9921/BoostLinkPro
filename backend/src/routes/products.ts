// ─── routes/products.ts (replaces the stub) ──────────────────────────────────
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import {
  getAll,
  getPublic,
  create,
  update,
  remove,
  toggleActive,
  upload,
} from "../controllers/products.ts";

const r = Router();

// Public route (no auth)
r.get("/public/:id", getPublic);

// Protected routes
r.use(authMiddleware);
r.get("/", getAll);
r.post("/", upload.single("file"), create);
r.patch("/:id", upload.single("file"), update);
r.delete("/:id", remove);
r.patch("/:id/toggle", toggleActive);

export default r;
