import { Router } from "express";
import { getPublicProfile } from "../controllers/profile.ts";

const r = Router();

r.get("/:username", getPublicProfile);

export default r;
