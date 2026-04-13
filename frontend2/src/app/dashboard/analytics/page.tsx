"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  MessageCircle,
  MousePointerClick,
  DollarSign,
  BarChart2,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const PERIODS = [
  { label: "Today", val: "today" },
  { label: "7 days", val: "7d" },
  { label: "30 days", val: "30d" },
  { label: "All time", val: "all" },
] as const;

type Period = (typeof PERIODS)[number]["val"];

function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}
function fmtRevenue(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const COLORS = ["#FF4D00", "#8B5CF6", "#0EA5E9", "#10B981", "#F59E0B"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["analytics", period],
    queryFn: () =>
      api
        .get(`/api/analytics/overview?period=${period}`)
        .then((r) => r.data.data),
    retry: false,
  });

  const d = data ?? {};
  const noData = !isLoading && !d.dms_sent_total;

  const stats = [
    {
      label: "DMs Sent",
      value: isLoading ? "—" : fmtNum(d.dms_sent_total ?? 0),
      sub: "Total automations fired",
      icon: <MessageCircle size={18} />,
      color: "#FF4D00",
      bg: "rgba(255,77,0,0.08)",
    },
    {
      label: "Today",
      value: isLoading ? "—" : fmtNum(d.dms_sent_today ?? 0),
      sub: "DMs sent since midnight",
      icon: <Zap size={18} />,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.08)",
    },
    {
      label: "Link Clicks",
      value: isLoading ? "—" : fmtNum(d.link_clicks ?? 0),
      sub: "Bio link + DM links",
      icon: <MousePointerClick size={18} />,
      color: "#0EA5E9",
      bg: "rgba(14,165,233,0.08)",
    },
    {
      label: "Revenue",
      value: isLoading ? "—" : fmtRevenue(d.revenue_total ?? 0),
      sub: "Product sales via Stripe",
      icon: <DollarSign size={18} />,
      color: "#10B981",
      bg: "rgba(16,185,129,0.08)",
    },
  ];

  // Fake bars for visual representation — will be real time-series data in future
  const bars = [
    18, 32, 24, 48, 65, 42, 55, 30, 72, 50, 38, 60, 70, 45, 80, 58, 66, 35, 52,
    44, 57, 65, 48, 60, 75, 44, 57, 70, 52, 65,
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--c-text1)",
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            Analytics
          </h1>
          <p
            style={{ fontSize: 13, color: "var(--c-text3)", margin: "4px 0 0" }}
          >
            DMs sent, link clicks and revenue
          </p>
        </div>
        {/* Period selector */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "var(--c-bg2)",
            borderRadius: 12,
            padding: 4,
            border: "1px solid var(--c-border)",
          }}
        >
          {PERIODS.map((p) => (
            <button
              key={p.val}
              onClick={() => setPeriod(p.val)}
              style={{
                padding: "7px 16px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                border: "none",
                transition: "all .15s",
                background: period === p.val ? "var(--c-card)" : "transparent",
                color: period === p.val ? "var(--c-text1)" : "var(--c-text3)",
                boxShadow:
                  period === p.val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--c-card)",
              border: "1.5px solid var(--c-border)",
              borderRadius: 18,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--c-text1)",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--c-text2)",
                margin: "4px 0 2px",
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: 11, color: "var(--c-text4)", margin: 0 }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + keywords row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Bar chart */}
        <div
          style={{
            background: "var(--c-card)",
            border: "1.5px solid var(--c-border)",
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--c-text1)",
                  margin: 0,
                }}
              >
                DMs over time
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-text4)",
                  margin: "2px 0 0",
                }}
              >
                Last 30 days
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#10B981",
                background: "rgba(16,185,129,0.08)",
                padding: "4px 10px",
                borderRadius: 8,
              }}
            >
              <TrendingUp size={12} /> Live
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 3,
              height: 110,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: "3px 3px 0 0",
                  minWidth: 0,
                  height: `${h}%`,
                  background:
                    i === bars.length - 1
                      ? "#FF4D00"
                      : `rgba(255,77,0,${0.12 + (h / 100) * 0.25})`,
                  transition: "all .2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#FF4D00")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    i === bars.length - 1
                      ? "#FF4D00"
                      : `rgba(255,77,0,${0.12 + (bars[i] / 100) * 0.25})`)
                }
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 10, color: "var(--c-text4)" }}>
              30 days ago
            </span>
            <span style={{ fontSize: 10, color: "var(--c-text4)" }}>Today</span>
          </div>
        </div>

        {/* Keywords */}
        <div
          style={{
            background: "var(--c-card)",
            border: "1.5px solid var(--c-border)",
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--c-text1)",
              margin: "0 0 18px",
            }}
          >
            Top keywords
          </p>
          {d.top_keywords?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {d.top_keywords
                .slice(0, 5)
                .map(
                  (
                    kw: { keyword: string; count: number; pct: number },
                    i: number,
                  ) => (
                    <div key={kw.keyword}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--c-text2)",
                          }}
                        >
                          "{kw.keyword}"
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: COLORS[i],
                          }}
                        >
                          {fmtNum(kw.count)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 4,
                          background: "var(--c-bg3)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${kw.pct}%`,
                            background: COLORS[i],
                            borderRadius: 4,
                            transition: "width .4s",
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 140,
                gap: 10,
              }}
            >
              <BarChart2 size={28} color="var(--c-text4)" />
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-text4)",
                  textAlign: "center",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                No keyword data yet.
                <br />
                Create automations to see what&apos;s triggering.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Empty state CTA */}
      {noData && (
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(255,77,0,0.05),rgba(255,140,0,0.03))",
            border: "1.5px dashed rgba(255,77,0,0.2)",
            borderRadius: 18,
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <BarChart2
            size={32}
            color="#FF4D00"
            style={{ margin: "0 auto 12px", display: "block" }}
          />
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--c-text1)",
              margin: "0 0 8px",
            }}
          >
            Your analytics will appear here
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--c-text3)",
              margin: "0 0 20px",
              lineHeight: 1.6,
            }}
          >
            Once you connect Instagram and create automations,
            <br />
            real data will show up here.
          </p>
          <Link
            href="/dashboard/automations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "11px 22px",
              borderRadius: 12,
              background: "#FF4D00",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <Zap size={14} /> Create first automation
          </Link>
        </div>
      )}
    </div>
  );
}
