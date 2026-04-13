import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { getAccount, connectCallback, disconnect, getPosts } from "../controllers/instagram.ts";
const r = Router();
r.get   ("/account",       authMiddleware, getAccount);
r.get   ("/auth/callback", authMiddleware, connectCallback);
r.delete("/disconnect",    authMiddleware, disconnect);
r.get   ("/posts",         authMiddleware, getPosts);
export default r;
