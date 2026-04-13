import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

import webhookRoutes from "./routes/webhooks.js";
import authRoutes from "./routes/auth.js";
import instagramRoutes from "./routes/instagram.js";
import automationRoutes from "./routes/automations.js";
import productRoutes from "./routes/products.js";
import analyticsRoutes from "./routes/analytics.js";
import bioLinksRoutes from "./routes/bioLinks.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Webhooks need raw body BEFORE json() parser
app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use("/api/webhooks", webhookRoutes);

// Security
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://undespondingly-unpenetrant-lena.ngrok-free.dev",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/automations", automationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/bio-links", bioLinksRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Express 5: error handler has 4 params
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  },
);

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`),
);
export default app;
