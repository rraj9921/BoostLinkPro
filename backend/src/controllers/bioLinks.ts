import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { supabase } from "../config/supabase";

/**
 * GET /api/bio-links
 * Get all bio links for the authenticated user
 */
export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("bio_links")
    .select("*")
    .eq("user_id", req.userId!)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Get bio links error:", error);
    res.status(500).json({ error: "Failed to fetch bio links" });
    return;
  }

  res.json({ success: true, data });
}

/**
 * POST /api/bio-links
 * Create a new bio link
 */
export async function create(req: AuthRequest, res: Response): Promise<void> {
  const { title, url, type } = req.body;

  if (!title?.trim() || !url?.trim()) {
    res.status(400).json({ error: "Title and URL are required" });
    return;
  }

  const validTypes = ["link", "product", "amazon", "myntra", "social"];
  if (type && !validTypes.includes(type)) {
    res.status(400).json({ error: "Invalid link type" });
    return;
  }

  // Get max sort_order and increment
  const { data: maxData } = await supabase
    .from("bio_links")
    .select("sort_order")
    .eq("user_id", req.userId!)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxData?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("bio_links")
    .insert({
      user_id: req.userId,
      title: title.trim(),
      url: url.trim(),
      type: type || "link",
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Create bio link error:", error);
    res.status(500).json({ error: "Failed to create bio link" });
    return;
  }

  res.json({ success: true, data });
}

/**
 * PATCH /api/bio-links/:id
 * Update a bio link
 */
export async function update(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, url, type, is_active } = req.body;

  const updates: any = {};
  if (title !== undefined) updates.title = title.trim();
  if (url !== undefined) updates.url = url.trim();
  if (type !== undefined) {
    const validTypes = ["link", "product", "amazon", "myntra", "social"];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: "Invalid link type" });
      return;
    }
    updates.type = type;
  }
  if (is_active !== undefined) updates.is_active = is_active;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const { data, error } = await supabase
    .from("bio_links")
    .update(updates)
    .eq("id", id)
    .eq("user_id", req.userId!)
    .select()
    .single();

  if (error) {
    console.error("Update bio link error:", error);
    res.status(404).json({ error: "Bio link not found or unauthorized" });
    return;
  }

  res.json({ success: true, data });
}

/**
 * DELETE /api/bio-links/:id
 * Delete a bio link
 */
export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const { error } = await supabase
    .from("bio_links")
    .delete()
    .eq("id", id)
    .eq("user_id", req.userId!);

  if (error) {
    console.error("Delete bio link error:", error);
    res.status(500).json({ error: "Failed to delete bio link" });
    return;
  }

  res.json({ success: true });
}

/**
 * PATCH /api/bio-links/reorder
 * Reorder bio links
 */
export async function reorder(req: AuthRequest, res: Response): Promise<void> {
  const { linkIds } = req.body as { linkIds: string[] };

  if (!Array.isArray(linkIds) || linkIds.length === 0) {
    res.status(400).json({ error: "linkIds array is required" });
    return;
  }

  try {
    // Update each link's sort_order
    const updates = linkIds.map((id, index) =>
      supabase
        .from("bio_links")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("user_id", req.userId!),
    );

    await Promise.all(updates);

    res.json({ success: true });
  } catch (error) {
    console.error("Reorder bio links error:", error);
    res.status(500).json({ error: "Failed to reorder bio links" });
  }
}

/**
 * PATCH /api/bio-links/:id/toggle
 * Toggle bio link active status
 */
export async function toggleActive(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  // Get current status
  const { data: current } = await supabase
    .from("bio_links")
    .select("is_active")
    .eq("id", id)
    .eq("user_id", req.userId!)
    .single();

  if (!current) {
    res.status(404).json({ error: "Bio link not found" });
    return;
  }

  const { data, error } = await supabase
    .from("bio_links")
    .update({ is_active: !current.is_active })
    .eq("id", id)
    .eq("user_id", req.userId!)
    .select()
    .single();

  if (error) {
    console.error("Toggle bio link error:", error);
    res.status(500).json({ error: "Failed to toggle bio link" });
    return;
  }

  res.json({ success: true, data });
}
