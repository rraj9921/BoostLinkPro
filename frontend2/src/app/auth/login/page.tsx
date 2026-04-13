"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  Zap,
  Eye,
  EyeOff,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Zap as ZapIcon,
} from "lucide-react";
import ThemeToggle from "@/components3/theme/ThemeToggle";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type F = z.infer<typeof schema>;

const features = [
  {
    icon: MessageCircle,
    color: "#FF4D00",
    bg: "rgba(255,77,0,0.12)",
    label: "Auto-DM on every comment",
  },
  {
    icon: ShoppingBag,
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    label: "Sell digital products",
  },
  {
    icon: TrendingUp,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    label: "Analytics dashboard",
  },
  {
    icon: ZapIcon,
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.12)",
    label: "Link-in-bio store",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: F) => {
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword(d);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      <style>{`
        /* Left panel */
        .auth-left {
          display: none;
          width: 46%;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1A0F16 0%, #140C11 50%, #0F0A0D 100%);
          padding: 56px;
          flex-shrink: 0;
        }
        @media(min-width:1024px){ .auth-left { display: flex; } }

        /* Orbs */
        .al-orb1 { position:absolute;top:-120px;right:-80px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(255,120,60,.18) 0%,transparent 70%);pointer-events:none; }
        .al-orb2 { position:absolute;bottom:-100px;left:-60px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(220,39,67,.14) 0%,transparent 75%);pointer-events:none; }
        .al-dots { position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.08) 1.5px,transparent 1.5px);background-size:28px 28px;opacity:.15; }
        .al-ring1 { position:absolute;top:-60px;right:-60px;width:280px;height:280px;border-radius:50%;border:1.5px solid rgba(255,122,61,.15);pointer-events:none; }
        .al-ring2 { position:absolute;bottom:-40px;left:40px;width:200px;height:200px;border-radius:50%;border:1px solid rgba(255,122,61,.12);pointer-events:none; }
        .al-instagram-faded { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;height:420px;opacity:0.04;pointer-events:none;z-index:1; }

        /* Feature pills */
        .feat-pill {
          display:flex;align-items:center;gap:12px;
          padding:16px 20px;border-radius:16px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12);
          backdrop-filter:blur(12px);
          transition:all .2s;
        }
        .feat-pill:hover { background:rgba(255,255,255,.10);transform:translateX(4px); }

        /* Right form */
        .auth-right { flex:1;display:flex;flex-direction:column;overflow-y:auto; }

        /* Input styles */
        .auth-input {
          width:100%;padding:13px 16px;border-radius:14px;
          font-size:15px;font-weight:500;font-family:inherit;
          background:var(--bg2);color:var(--text1);
          border:1.5px solid var(--border);
          outline:none;transition:border-color .2s,box-shadow .2s;
          box-sizing:border-box;
        }
        .auth-input::placeholder { color:var(--text4); }
        .auth-input:focus { border-color:#FF4D00;box-shadow:0 0 0 4px rgba(255,77,0,.08); }
        .auth-input.err { border-color:#EF4444; }

        /* Submit btn */
        .auth-btn {
          width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
          background:linear-gradient(135deg,#f09433 0%,#dc2743 50%,#bc1888 100%);
          color:white;font-weight:700;font-size:16px;font-family:inherit;
          padding:16px;border-radius:14px;border:none;cursor:pointer;
          box-shadow:0 10px 32px rgba(255,77,0,.32);
          transition:all .2s cubic-bezier(.16,1,.3,1);
        }
        .auth-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 16px 42px rgba(255,77,0,.44); }
        .auth-btn:disabled { opacity:.6;cursor:not-allowed; }

        /* Animate in */
        .auth-form-wrap { animation:authUp .55s cubic-bezier(.16,1,.3,1) both; }
        @keyframes authUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="al-orb1" />
        <div className="al-orb2" />
        <div className="al-dots" />
        <div className="al-ring1" />
        <div className="al-ring2" />

        {/* Faded Instagram Icon */}
        <div className="al-instagram-faded">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "#FF7A3D" }}
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 2 }}>
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
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(220,39,67,.3)",
              }}
            >
              <Zap size={18} color="white" fill="white" />
            </div>
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              BoostLink<span style={{ opacity: 0.8 }}>Pro</span>
            </span>
          </Link>
        </div>

        {/* Middle content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,122,61,.15)",
              border: "1px solid rgba(255,122,61,.25)",
              borderRadius: 100,
              padding: "7px 18px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "white",
                letterSpacing: "0.02em",
              }}
            >
              👋 Welcome back
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(28px,3vw,40px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            Your automations
            <br />
            have been running
            <br />
            while you were away.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,.75)",
              lineHeight: 1.72,
              marginBottom: 36,
              maxWidth: 320,
            }}
          >
            Sign in to check your DMs, see your sales, and manage your
            automations.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {features.map(({ icon: Icon, color, bg, label }) => (
              <div key={label} className="feat-pill">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} color={color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 12,
            color: "rgba(255,255,255,.45)",
          }}
        >
          © 2026 BoostLink Pro · All rights reserved
        </p>
      </div>

      {/* ── Right form ── */}
      <div className="auth-right">
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text3)",
              textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#FF4D00")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--text3)")}
          >
            <ArrowLeft size={15} /> Back to home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ThemeToggle />
            <span style={{ fontSize: 14, color: "var(--text3)" }}>
              No account?{" "}
              <Link
                href="/auth/signup"
                style={{
                  fontWeight: 700,
                  color: "#FF4D00",
                  textDecoration: "none",
                }}
              >
                Sign up free
              </Link>
            </span>
          </div>
        </div>

        {/* Form area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 36px",
          }}
        >
          <div
            className="auth-form-wrap"
            style={{ width: "100%", maxWidth: 420 }}
          >
            {/* Mobile logo */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                textDecoration: "none",
                marginBottom: 32,
              }}
              className="lg-hide"
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={15} color="white" fill="white" />
              </div>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--text1)",
                  letterSpacing: "-0.02em",
                }}
              >
                BoostLink<span style={{ color: "#FF4D00" }}>Pro</span>
              </span>
            </Link>

            <h1
              style={{
                fontSize: "clamp(26px,3.5vw,34px)",
                fontWeight: 800,
                color: "var(--text1)",
                letterSpacing: "-0.025em",
                marginBottom: 6,
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--text3)",
                marginBottom: 36,
                lineHeight: 1.5,
              }}
            >
              Enter your details to access your dashboard
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text2)",
                    marginBottom: 8,
                  }}
                >
                  Email address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`auth-input${errors.email ? " err" : ""}`}
                />
                {errors.email && (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <label
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text2)",
                    }}
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#FF4D00",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    {...register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    className={`auth-input${errors.password ? " err" : ""}`}
                    style={{ paddingRight: 46 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text3)",
                      cursor: "pointer",
                      display: "flex",
                      padding: 4,
                    }}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-btn"
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Signing in…
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "28px 0",
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
              <span
                style={{ fontSize: 12, color: "var(--text4)", fontWeight: 600 }}
              >
                OR
              </span>
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "var(--text3)",
              }}
            >
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                style={{
                  fontWeight: 700,
                  color: "#FF4D00",
                  textDecoration: "none",
                }}
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
