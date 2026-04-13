import { Router } from "express";
import { getPublicProfile } from "../controllers/profile";

const r = Router();

r.get("/:username", getPublicProfile);

export default r;
