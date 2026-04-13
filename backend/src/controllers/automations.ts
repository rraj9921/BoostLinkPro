import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import { supabase } from "../config/supabase.ts";
import * as z from "zod"; // Zod v4

const schema = z.object({
  name:             z.string().min(1),
  keywords:         z.array(z.string()).min(1),
  dm_message:       z.string().min(1),
  comment_reply:    z.string().default(""),
  follow_condition: z.boolean().default(false),
  post_ids:         z.array(z.string()).default([]),
});

export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("automations").select("*")
    .eq("user_id", req.userId!).order("created_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true, data });
}

export async function getOne(req: AuthRequest, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("automations").select("*")
    .eq("id", req.params.id).eq("user_id", req.userId!).single();
  if (error || !data) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true, data });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { data: ig } = await supabase
    .from("instagram_accounts").select("id").eq("user_id", req.userId!).single();
  if (!ig) { res.status(400).json({ error: "Connect your Instagram account first" }); return; }

  const { data, error } = await supabase
    .from("automations")
    .insert({ ...parsed.data, user_id: req.userId, ig_account_id: ig.id })
    .select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json({ success: true, data });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const { data, error } = await supabase
    .from("automations")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", req.params.id).eq("user_id", req.userId!).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true, data });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const { error } = await supabase
    .from("automations").delete().eq("id", req.params.id).eq("user_id", req.userId!);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true });
}

export async function toggle(req: AuthRequest, res: Response): Promise<void> {
  const { data: cur } = await supabase
    .from("automations").select("is_active").eq("id", req.params.id).eq("user_id", req.userId!).single();
  if (!cur) { res.status(404).json({ error: "Not found" }); return; }
  const { data, error } = await supabase
    .from("automations").update({ is_active: !(cur.is_active as boolean) })
    .eq("id", req.params.id).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true, data });
}
