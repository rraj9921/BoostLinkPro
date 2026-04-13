"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components3/theme/ThemeToggle";
import {
  LayoutDashboard,
  Zap,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  Link2,
  Bell,
  Menu
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/automations", icon: Zap, label: "Automations" },
  { href: "/dashboard/biolinks", icon: Link2, label: "Bio Links" },
  { href: "/dashboard/products", icon: ShoppingBag, label: "Products" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, setLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) {
          router.push("/auth/login");
          return;
        }
        setUser(session.user);
        setLoading(false);
      });
  }, [router, setUser, setLoading]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const name =
    (user?.user_metadata?.full_name as string)?.split(" ")[0] ?? "Creator";
  const uname = user?.user_metadata?.username as string | undefined;
  const avatar = name[0]?.toUpperCase() ?? "C";
  const currentLabel =
    NAV.find(
      (n) =>
        pathname === n.href ||
        (n.href !== "/dashboard" && pathname.startsWith(n.href)),
    )?.label ?? "Dashboard";

  function Sidebar() {
    return (
      <aside
        style={{
          width: 224,
          display: "flex",
          flexDirection: "column",
          background: "var(--c-card)",
          borderRight: "1px solid var(--c-border)",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 18px 18px",
            borderBottom: "1px solid var(--c-border)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 6px 16px rgba(240,148,51,0.35)",
              }}
            >
              <Zap size={15} color="white" fill="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--c-text1)",
                letterSpacing: "-0.02em",
              }}
            >
              BoostLink
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pro
              </span>
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav
          style={{
            flex: 1,
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.2s",
                  background: active
                    ? "linear-gradient(135deg, rgba(240,148,51,0.08) 0%, rgba(220,39,67,0.08) 100%)"
                    : "transparent",
                  color: active ? "#dc2743" : "var(--c-text3)",
                  position: "relative",
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 20,
                      borderRadius: "0 4px 4px 0",
                      background:
                        "linear-gradient(180deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                    }}
                  />
                )}
                <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#dc2743",
                      flexShrink: 0,
                      boxShadow: "0 0 8px rgba(220,39,67,0.4)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bio link */}
        <div style={{ padding: "0 12px 12px" }}>
          <Link
            href={uname ? `/${uname}` : "#"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "10px 14px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--c-text3)",
              border: "1.5px solid var(--c-border)",
              background: "var(--c-bg2)",
              transition: "all 0.2s",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(240,148,51,0.3)";
              e.currentTarget.style.background = "rgba(240,148,51,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--c-border)";
              e.currentTarget.style.background = "var(--c-bg2)";
            }}
          >
            <Link2 size={14} style={{ flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              /{uname ?? "yourname"}
            </span>
          </Link>
        </div>

        {/* User + sign out */}
        <div
          style={{ padding: "12px", borderTop: "1px solid var(--c-border)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              borderRadius: 12,
              background: "var(--c-bg2)",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(240,148,51,0.25)",
              }}
            >
              {avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--c-text1)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </p>
              <p style={{ fontSize: 11, color: "var(--c-text3)", margin: 0 }}>
                Free plan
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              padding: "9px 14px",
              borderRadius: 11,
              border: "none",
              background: "none",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--c-text3)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#EF4444";
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "var(--c-text3)";
              e.currentTarget.style.background = "none";
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", background: "var(--c-bg)" }}
    >
      <style>{`
        @media (max-width: 768px) {
          .dash-sidebar-fixed { display: none !important; }
          .dash-main { margin-left: 0 !important; }
        }
        @media (min-width: 769px) {
          .dash-mobile-overlay { display: none !important; }
          .dash-mobile-btn { display: none !important; }
        }
        .dash-mobile-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.5); display: flex;
        }
      `}</style>

      {/* Desktop sidebar */}
      <div
        className="dash-sidebar-fixed"
        style={{
          width: 224,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="dash-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 224, height: "100%", flexShrink: 0 }}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="dash-main"
        style={{
          marginLeft: 224,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          isolation: "isolate",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            position: "sticky",
            top: 0,
            zIndex: 29,
            background: "var(--c-card)",
            borderBottom: "1px solid var(--c-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="dash-mobile-btn"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--c-text2)",
                display: "flex",
              }}
            >
              <Menu size={21} />
            </button>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--c-text1)",
                margin: 0,
              }}
            >
              {currentLabel}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--c-bg2)",
                border: "1.5px solid var(--c-border)",
                color: "var(--c-text3)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(240,148,51,0.06)";
                e.currentTarget.style.borderColor = "rgba(240,148,51,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--c-bg2)";
                e.currentTarget.style.borderColor = "var(--c-border)";
              }}
            >
              <Bell size={15} />
            </button>
            <ThemeToggle />
            <Link
              href="/dashboard/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
                padding: "10px 20px",
                borderRadius: 11,
                background:
                  "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                color: "white",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(240,148,51,0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(240,148,51,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(240,148,51,0.3)";
              }}
            >
              ⚡ Upgrade
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: "32px" }}>{children}</main>
      </div>
    </div>
  );
}
