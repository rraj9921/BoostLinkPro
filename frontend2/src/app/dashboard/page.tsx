"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  MessageCircle,
  Zap,
  MousePointerClick,
  DollarSign,
  Instagram,
  ArrowRight,
  Plus,
  ShoppingBag,
  Activity,
  TrendingUp,
  Sparkles,
  Eye,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { cardStyle, formatCurrency, formatNum } from "./_shared";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const name =
    (user?.user_metadata?.full_name as string)?.split(" ")[0] ?? "Creator";

  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["analytics"],
    queryFn: () => api.get("/api/analytics/overview").then((r) => r.data.data),
    retry: false,
  });
  const { data: ig } = useQuery<any>({
    queryKey: ["ig"],
    queryFn: () => api.get("/api/instagram/account").then((r) => r.data.data),
    retry: false,
  });

  const v = (key: string, fallback = 0) =>
    isLoading ? "—" : (stats?.[key] ?? fallback);

  const statCards = [
    {
      label: "DMs Sent Today",
      value: v("dms_sent_today"),
      icon: MessageCircle,
      gradient:
        "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
      iconBg: "rgba(240,148,51,0.1)",
      iconColor: "#f09433",
    },
    {
      label: "Total DMs Sent",
      value: v("dms_sent_total"),
      icon: Zap,
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
      iconBg: "rgba(139,92,246,0.1)",
      iconColor: "#8B5CF6",
    },
    {
      label: "Link Clicks",
      value: v("link_clicks"),
      icon: MousePointerClick,
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
      iconBg: "rgba(14,165,233,0.1)",
      iconColor: "#0EA5E9",
    },
    {
      label: "Revenue",
      value: isLoading ? "—" : formatCurrency(stats?.revenue_total ?? 0),
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      iconBg: "rgba(16,185,129,0.1)",
      iconColor: "#10B981",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/automations",
      icon: Zap,
      gradient:
        "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
      iconBg: "rgba(240,148,51,0.1)",
      iconColor: "#f09433",
      title: "Create Automation",
      desc: "Set keyword triggers on posts",
    },
    {
      href: "/dashboard/products",
      icon: ShoppingBag,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      iconBg: "rgba(16,185,129,0.1)",
      iconColor: "#10B981",
      title: "Add Digital Product",
      desc: "Upload and sell to your audience",
    },
    {
      href: "/dashboard/settings",
      icon: Instagram,
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
      iconBg: "rgba(139,92,246,0.1)",
      iconColor: "#8B5CF6",
      title: "Connect Instagram",
      desc: "Link your business account",
    },
  ];

  const checklist = [
    { done: !!user, label: "Create your account" },
    { done: !!ig, label: "Connect Instagram account" },
    { done: false, label: "Create your first automation" },
    { done: false, label: "Add a digital product" },
    { done: false, label: "Share your bio link" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const donePct = (doneCount / checklist.length) * 100;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 0 60px" }}>
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(240,148,51,0.03) 0%, rgba(220,39,67,0.03) 100%)",
          borderRadius: 20,
          padding: "32px",
          marginBottom: 40,
          border: "1px solid rgba(240,148,51,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--c-text1)",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              Hey, {name}! 👋
            </h1>
            <p
              style={{ fontSize: 15, color: "var(--c-text3)", margin: "8px 0 0", fontWeight: 500 }}
            >
              Here&apos;s your growth overview
            </p>
          </div>
          <Link
            href="/dashboard/automations"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              color: "white",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(240,148,51,0.35)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(240,148,51,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(240,148,51,0.35)";
            }}
          >
            <Plus size={16} /> New Automation
          </Link>
        </div>
      </div>

      {/* Connect Instagram banner */}
      {!ig && !isLoading && (
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderRadius: 18,
            flexWrap: "wrap",
            gap: 16,
            background:
              "linear-gradient(135deg, rgba(240,148,51,0.05) 0%, rgba(220,39,67,0.05) 50%, rgba(188,24,136,0.05) 100%)",
            border: "1.5px solid rgba(240,148,51,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gradient accent */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background:
                "linear-gradient(180deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingLeft: 8,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 20px rgba(240,148,51,0.25)",
              }}
            >
              <Instagram size={22} color="white" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--c-text1)",
                  margin: 0,
                }}
              >
                Connect your Instagram
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--c-text3)",
                  margin: "4px 0 0",
                }}
              >
                Required to start sending automated DMs to your followers
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              color: "white",
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: "0 6px 20px rgba(240,148,51,0.3)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(240,148,51,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(240,148,51,0.3)";
            }}
          >
            Connect now <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Stats Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--c-text2)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Performance Metrics
          </h2>
          <div
            style={{
              width: 50,
              height: 3,
              background: "linear-gradient(90deg, #f09433 0%, #dc2743 100%)",
              borderRadius: 99,
              marginTop: 8,
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
        {statCards.map(
          ({ label, value, icon: Icon, gradient, iconBg, iconColor }) => (
            <div
              key={label}
              style={{
                ...cardStyle,
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid var(--c-border)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Gradient border top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: gradient,
                }}
              />

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon size={22} color={iconColor} strokeWidth={2.5} />
              </div>

              <p
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  background: gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {value}
              </p>

              <p
                style={{
                  fontSize: 13,
                  color: "var(--c-text3)",
                  margin: "8px 0 0",
                  fontWeight: 500,
                }}
              >
                {label}
              </p>
            </div>
          ),
        )}
        </div>
      </div>

      {/* Content Grid - Quick Actions + Getting Started */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 40,
        }}
      >
        {/* Quick actions */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--c-text2)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Quick Actions
            </h2>
            <div
              style={{
                width: 50,
                height: 3,
                background: "linear-gradient(90deg, #f09433 0%, #dc2743 100%)",
                borderRadius: 99,
                marginTop: 8,
              }}
            />
          </div>
          <div style={{ ...cardStyle, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid var(--c-border)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <Sparkles size={20} color="var(--c-text3)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quickActions.map(
              ({
                href,
                icon: Icon,
                gradient,
                iconBg,
                iconColor,
                title,
                desc,
              }) => (
                <Link
                  key={title}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    textDecoration: "none",
                    border: "1.5px solid var(--c-border)",
                    background: "var(--c-bg2)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.08)";
                    const gradientElem = e.currentTarget.querySelector(
                      ".action-gradient",
                    ) as HTMLElement;
                    if (gradientElem) gradientElem.style.opacity = "1";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--c-border)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    const gradientElem = e.currentTarget.querySelector(
                      ".action-gradient",
                    ) as HTMLElement;
                    if (gradientElem) gradientElem.style.opacity = "0";
                  }}
                >
                  {/* Gradient border overlay */}
                  <div
                    className="action-gradient"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: gradient,
                      opacity: 0,
                      transition: "opacity 0.25s",
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="action-gradient"
                    style={{
                      position: "absolute",
                      inset: "1.5px",
                      background: "var(--c-bg2)",
                      borderRadius: "12.5px",
                      zIndex: 1,
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 11,
                      background: iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <Icon size={18} color={iconColor} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--c-text1)",
                        margin: 0,
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--c-text3)",
                        margin: "3px 0 0",
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    color="var(--c-text4)"
                    style={{ flexShrink: 0, position: "relative", zIndex: 2 }}
                  />
                </Link>
              ),
            )}
          </div>
        </div>
        </div>

        {/* Getting started checklist */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--c-text2)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Getting Started
            </h2>
            <div
              style={{
                width: 50,
                height: 3,
                background: "linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%)",
                borderRadius: 99,
                marginTop: 8,
              }}
            />
          </div>
        <div style={{ ...cardStyle, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid var(--c-border)" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--c-text4)",
              marginBottom: 14,
            }}
          >
            Getting started
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {checklist.map(({ done, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done ? "rgba(16,185,129,0.12)" : "var(--c-bg3)",
                    border: done
                      ? "1.5px solid rgba(16,185,129,0.3)"
                      : "1.5px solid var(--c-border)",
                  }}
                >
                  {done && (
                    <span style={{ fontSize: 10, color: "#10B981" }}>✓</span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: done ? 500 : 600,
                    color: done ? "var(--c-text2)" : "var(--c-text3)",
                    textDecoration: done ? "line-through" : "none",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 18,
              height: 6,
              borderRadius: 6,
              background: "var(--c-bg3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${donePct}%`,
                background:
                  "linear-gradient(90deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                borderRadius: 6,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  donePct > 0 ? "0 0 12px rgba(240,148,51,0.4)" : "none",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--c-text3)",
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            {doneCount} of {checklist.length} steps complete
          </p>
        </div>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--c-text2)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Recent Activity
          </h2>
          <div
            style={{
              width: 50,
              height: 3,
              background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
              borderRadius: 99,
              marginTop: 8,
            }}
          />
        </div>
      <div style={{ ...cardStyle, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid var(--c-border)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--c-text1)",
              margin: 0,
            }}
          >
            Recent Activity
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--c-text4)",
            }}
          >
            <Activity size={13} /> Live
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 0",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--c-bg2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            💬
          </div>
          <p style={{ fontSize: 13, color: "var(--c-text3)", margin: 0 }}>
            No automations running yet — create your first one
          </p>
        </div>
        <Link
          href="/dashboard/automations"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            marginTop: 12,
            padding: "13px 20px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 700,
            color: "white",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 4px 16px rgba(240,148,51,0.25)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(240,148,51,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(240,148,51,0.25)";
          }}
        >
          <Plus size={16} strokeWidth={2.5} /> Create your first automation
        </Link>
      </div>
      </div>
    </div>
  );
}
