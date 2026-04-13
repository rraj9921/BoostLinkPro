import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { supabase } from "../config/supabase";
import axios from "axios";

export async function getAccount(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { data, error } = await supabase
    .from("instagram_accounts")
    .select(
      "id,username,name,profile_picture_url,followers_count,is_connected,connected_at,token_expires_at",
    )
    .eq("user_id", req.userId!)
    .single();
  if (error || !data) {
    res.json({ success: true, data: null });
    return;
  }
  res.json({ success: true, data });
}

export async function connectCallback(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { code } = req.query;
    if (!code) {
      res.status(400).json({ error: "Missing code" });
      return;
    }

    // Exchange for short-lived token
    const tokenRes = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.FRONTEND_URL}/dashboard/settings`,
        code: code as string,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const shortToken =
      tokenRes.data.access_token ?? tokenRes.data[0]?.access_token;
    if (!shortToken)
      throw new Error("No access token: " + JSON.stringify(tokenRes.data));

    // Exchange for long-lived token (60 days)
    const longRes = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.META_APP_SECRET,
          access_token: shortToken,
        },
      },
    );
    const { access_token, expires_in } = longRes.data as {
      access_token: string;
      expires_in: number;
    };

    // Get profile
    const profile = await axios.get("https://graph.instagram.com/v21.0/me", {
      params: {
        fields: "id,username,name,profile_picture_url,followers_count",
        access_token,
      },
    });

    await supabase.from("instagram_accounts").upsert(
      {
        user_id: req.userId,
        ig_user_id: profile.data.id as string,
        username: profile.data.username as string,
        name: profile.data.name as string,
        profile_picture_url: profile.data.profile_picture_url as string,
        access_token,
        token_expires_at: new Date(
          Date.now() + expires_in * 1000,
        ).toISOString(),
        followers_count: (profile.data.followers_count as number) || 0,
        is_connected: true,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    res.json({ success: true, message: "Instagram connected" });
  } catch (err: any) {
    console.error("Connect error:", err?.response?.data ?? err);
    res.status(500).json({ error: "Failed to connect Instagram" });
  }
}

export async function disconnect(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  await supabase.from("instagram_accounts").delete().eq("user_id", req.userId!);
  res.json({ success: true });
}

export async function getPosts(req: AuthRequest, res: Response): Promise<void> {
  const { data: ig } = await supabase
    .from("instagram_accounts")
    .select("access_token")
    .eq("user_id", req.userId!)
    .single();
  if (!ig) {
    res.status(400).json({ error: "No Instagram connected" });
    return;
  }
  const r = await axios.get("https://graph.instagram.com/v21.0/me/media", {
    params: {
      fields: "id,caption,media_type,thumbnail_url,permalink,timestamp",
      access_token: ig.access_token,
      limit: 20,
    },
  });
  res.json({ success: true, data: r.data.data });
}
