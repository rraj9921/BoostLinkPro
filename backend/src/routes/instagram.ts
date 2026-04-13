import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getAccount, connectCallback, disconnect, getPosts } from "../controllers/instagram";
const r = Router();
r.get   ("/account",       authMiddleware, getAccount);
r.get   ("/auth/callback", authMiddleware, connectCallback);
r.delete("/disconnect",    authMiddleware, disconnect);
r.get   ("/posts",         authMiddleware, getPosts);
export default r;
