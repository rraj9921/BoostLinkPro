import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import {
  getAll,
  create,
  update,
  remove,
  reorder,
  toggleActive,
} from "../controllers/bioLinks.ts";

const r = Router();

r.use(authMiddleware);

r.get("/", getAll);
r.post("/", create);
r.patch("/reorder", reorder);
r.patch("/:id", update);
r.patch("/:id/toggle", toggleActive);
r.delete("/:id", remove);

export default r;
