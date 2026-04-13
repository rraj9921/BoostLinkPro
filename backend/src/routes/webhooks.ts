import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { processCommentEvent } from "../services/automation/automationEngine";

const router = Router();

// GET — Meta webhook verification
router.get("/instagram", (req: Request, res: Response): void => {
  const mode      = req.query["hub.mode"];
  const token     = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified by Meta");
    res.status(200).send(challenge);
    return;
  }
  res.status(403).json({ error: "Verification failed" });
});

// POST — receive comment events
router.post("/instagram", (req: Request, res: Response): void => {
  const sig = req.headers["x-hub-signature-256"] as string;
  if (!verifySignature(req.body as Buffer, sig)) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }
  // Acknowledge immediately — Meta requires response within 5s
  res.status(200).json({ received: true });
  // Process async
  const body = JSON.parse((req.body as Buffer).toString());
  handleAsync(body).catch(console.error);
});

// POST — Meta required data deletion callback
router.post("/meta/data-deletion", (_req: Request, res: Response): void => {
  const code = crypto.randomUUID();
  res.json({
    url: `${process.env.FRONTEND_URL}/data-deletion?id=${code}`,
    confirmation_code: code,
  });
});

function verifySignature(body: Buffer, sig: string): boolean {
  if (!sig || !process.env.META_APP_SECRET) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", process.env.META_APP_SECRET).update(body).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)); } catch { return false; }
}

async function handleAsync(body: { entry?: Array<{ id: string; changes?: Array<{ field: string; value: { from?: { id: string; username?: string }; text?: string; media?: { id: string }; id: string } }> }> }): Promise<void> {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field === "comments") {
        await processCommentEvent({
          igAccountId:       entry.id,
          commenterId:       change.value.from?.id ?? "",
          commenterUsername: change.value.from?.username ?? "",
          commentText:       change.value.text ?? "",
          postId:            change.value.media?.id ?? "",
          commentId:         change.value.id,
        });
      }
    }
  }
}

export default router;
