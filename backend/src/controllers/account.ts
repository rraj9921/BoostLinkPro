import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { supabase } from "../config/supabase.js";
import { createClient } from "@supabase/supabase-js";

/** Admin Supabase client (service role) — used for deleting auth users */
function adminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * DELETE /api/account
 * Permanently removes all user data and the auth record.
 * Required for Meta App Review data deletion compliance + GDPR.
 */
export async function deleteAccount(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;

  // 1. Revoke Meta access token (best-effort, don't block on failure)
  try {
    const { data: ig } = await supabase
      .from("instagram_accounts")
      .select("access_token")
      .eq("user_id", userId)
      .maybeSingle();

    if (ig?.access_token) {
      await fetch(
        `https://graph.facebook.com/v19.0/me/permissions?access_token=${ig.access_token}`,
        { method: "DELETE" }
      );
    }
  } catch {
    // Continue even if token revocation fails
  }

  // 2. Delete data tables in dependency order
  const tables = [
    "comment_events",
    "automations",
    "products",
    "instagram_accounts",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", userId);
    if (error) console.error(`[deleteAccount] Error deleting ${table}:`, error.message);
  }

  // 3. Delete Supabase auth user
  const { error } = await adminClient().auth.admin.deleteUser(userId);
  if (error) {
    console.error("[deleteAccount] Failed to delete auth user:", error.message);
    res.status(500).json({ error: "Failed to delete account. Please try again." });
    return;
  }

  res.json({ success: true });
}

/**
 * PATCH /api/account/profile
 * Updates full_name and username in both profiles table and auth metadata.
 */
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { full_name, username } = req.body as { full_name?: string; username?: string };

  if (!full_name?.trim() || !username?.trim()) {
    res.status(400).json({ error: "full_name and username are required" });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
    res.status(400).json({ error: "Username must be 3–30 chars: letters, numbers and _ only" });
    return;
  }

  // Check uniqueness
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", cleanUsername)
    .neq("id", userId)
    .maybeSingle();

  if (existing) {
    res.status(409).json({ error: "That username is already taken" });
    return;
  }

  await supabase.from("profiles").upsert({
    id: userId,
    full_name: full_name.trim(),
    username: cleanUsername,
    updated_at: new Date().toISOString(),
  });

  // Sync to auth metadata so client store stays current
  await adminClient().auth.admin.updateUserById(userId, {
    user_metadata: { full_name: full_name.trim(), username: cleanUsername },
  });

  res.json({ success: true });
}

/**
 * GET /api/account/export
 * Returns all user data as JSON (GDPR data portability).
 */
export async function exportData(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;

  const [automations, products, events, ig] = await Promise.all([
    supabase.from("automations").select("*").eq("user_id", userId).then(r => r.data ?? []),
    supabase.from("products").select("name,description,price_cents,type,sales_count,created_at").eq("user_id", userId).then(r => r.data ?? []),
    supabase.from("comment_events").select("commenter_username,comment_text,keyword_matched,dm_sent,created_at").eq("user_id", userId).then(r => r.data ?? []),
    supabase.from("instagram_accounts").select("username,followers_count,connected_at").eq("user_id", userId).maybeSingle().then(r => r.data),
  ]);

  res.setHeader("Content-Disposition", `attachment; filename="boostlinkpro-export-${Date.now()}.json"`);
  res.json({
    exported_at: new Date().toISOString(),
    automations,
    products,
    comment_events: events,
    instagram: ig,
  });
}
