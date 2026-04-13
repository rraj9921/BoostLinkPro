import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import { supabase } from "../config/supabase.ts";

function periodStart(period: string): string {
  const now = new Date();
  switch (period) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    }
    case "7d":
      return new Date(now.getTime() - 7 * 86400000).toISOString();
    case "30d":
      return new Date(now.getTime() - 30 * 86400000).toISOString();
    default:
      return new Date(0).toISOString(); // all time
  }
}

export async function getOverview(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const period = (req.query.period as string) || "7d";
  const since = periodStart(period);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const userId = req.userId!;

  // Get this user's instagram account id for filtering
  const { data: ig } = await supabase
    .from("instagram_accounts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  const igId = ig?.id;

  // Build filter for comment_events (scoped to user's automations)
  const eventsFilter = igId
    ? supabase
        .from("comment_events")
        .select("id,keyword_matched,dm_sent,created_at")
        .eq("dm_sent", true)
        .gte("created_at", since)
    : // filter through automation join
      null;

  const [todayRes, totalRes, activeRes, keywordsRes] = await Promise.all([
    supabase
      .from("comment_events")
      .select("id", { count: "exact", head: true })
      .eq("dm_sent", true)
      .gte("created_at", today.toISOString()),

    supabase
      .from("comment_events")
      .select("id", { count: "exact", head: true })
      .eq("dm_sent", true),

    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),

    // Top keywords from matched events
    supabase
      .from("comment_events")
      .select("keyword_matched")
      .eq("dm_sent", true)
      .gte("created_at", since)
      .not("keyword_matched", "is", null),
  ]);

  // Aggregate keywords
  const keywordCounts: Record<string, number> = {};
  for (const row of keywordsRes.data ?? []) {
    const kw = row.keyword_matched as string;
    keywordCounts[kw] = (keywordCounts[kw] ?? 0) + 1;
  }
  const totalKwCount =
    Object.values(keywordCounts).reduce((a, b) => a + b, 0) || 1;
  const top_keywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({
      keyword,
      count,
      pct: Math.round((count / totalKwCount) * 100),
    }));

  res.json({
    success: true,
    data: {
      dms_sent_today: todayRes.count ?? 0,
      dms_sent_total: totalRes.count ?? 0,
      active_automations: activeRes.count ?? 0,
      link_clicks: 0,
      revenue_total: 0,
      profile_views: 0,
      top_keywords,
    },
  });
}
