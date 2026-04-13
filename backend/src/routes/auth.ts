import { Router } from "express";
const r = Router();
r.get("/me", (_req, res) => res.json({ message: "Auth handled by Supabase client" }));
export default r;
