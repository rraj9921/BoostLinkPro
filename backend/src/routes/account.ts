// ─── routes/account.ts ───────────────────────────────────────────────────────
// Add to index.ts: import accountRoutes from "./routes/account.js";
//                  app.use("/api/account", accountRoutes);

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { deleteAccount, updateProfile, exportData } from "../controllers/account";

const r = Router();
r.use(authMiddleware);

r.delete("/",         deleteAccount);
r.patch ("/profile",  updateProfile);
r.get   ("/export",   exportData);

export default r;
