import type { Request, Response } from "express";
import { supabase } from "../config/supabase";

/**
 * GET /api/profile/:username
 * Get public profile data for a username (bio link page)
 */
export async function getPublicProfile(
  req: Request,
  res: Response,
): Promise<void> {
  const { username } = req.params;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, full_name, bio, avatar_url")
      .eq("username", username.toLowerCase())
      .single();

    if (profileError || !profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    // Get Instagram account info (optional)
    const { data: instagram } = await supabase
      .from("instagram_accounts")
      .select("username, profile_picture_url, followers_count")
      .eq("user_id", profile.id)
      .eq("is_connected", true)
      .maybeSingle();

    // Get active bio links
    const { data: bioLinks } = await supabase
      .from("bio_links")
      .select("id, title, url, type, sort_order")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    // Get active products
    const { data: products } = await supabase
      .from("products")
      .select("id, name, description, price_cents, type, thumbnail_url")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    res.json({
      success: true,
      data: {
        profile: {
          username: profile.username,
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        },
        instagram: instagram || null,
        bioLinks: bioLinks || [],
        products: products || [],
      },
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}
