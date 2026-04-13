"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Zap, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import ThemeToggle from "@/components3/theme/ThemeToggle";

const schema = z.object({
  full_name: z.string().min(2, "Enter your name"),
  username: z
    .string()
    .min(3, "Min 3 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase, numbers and _ only"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type F = z.infer<typeof schema>;

const perks = [
  "Comment-to-DM automation",
  "Sell digital products automatically",
  "Link-in-bio store",
  "Real-time analytics dashboard",
  "24/7 automation — works while you sleep",
];

const freeIncludes = [
  "Link in bio",
  "Link Unlimited Post",
  "Up to 2,000 DMs/month",
  "No credit card required",
];

export default function SignupPage() {
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
    const { error } = await createClient().auth.signUp({
      email: d.email,
      password: d.password,
      options: { data: { full_name: d.full_name, username: d.username } },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success("Account created! Welcome 🎉");
    router.push("/dashboard");
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      <style>{`
        .su-left {
          display:none;width:44%;flex-direction:column;justify-content:space-between;
          background:var(--bg2);border-right:1px solid var(--border);
          padding:48px;flex-shrink:0;position:relative;overflow:hidden;
        }
        @media(min-width:1024px){ .su-left{display:flex} }

        /* Subtle bg pattern */
        .su-dots{position:absolute;inset:0;pointer-events:none;
          background-image:radial-gradient(var(--border2) 1px,transparent 1px);
          background-size:24px 24px;opacity:.7}
        .su-glow{position:absolute;top:-80px;right:-80px;width:400px;height:400px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,120,60,.12) 0%,transparent 70%);filter:blur(48px);pointer-events:none}

        /* Perk items */
        .perk-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
        .perk-item:last-child{border-bottom:none}

        /* Free card */
        .free-card{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:22px 24px;position:relative;overflow:hidden}
        .free-card-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#f09433,#dc2743,#bc1888)}

        /* Right */
        .su-right{flex:1;display:flex;flex-direction:column;overflow-y:auto}

        /* Inputs */
        .su-input{
          width:100%;padding:13px 16px;border-radius:14px;
          font-size:15px;font-weight:500;font-family:inherit;
          background:var(--bg2);color:var(--text1);
          border:1.5px solid var(--border);
          outline:none;transition:border-color .2s,box-shadow .2s;
          box-sizing:border-box;
        }
        .su-input::placeholder{color:var(--text4)}
        .su-input:focus{border-color:#FF4D00;box-shadow:0 0 0 4px rgba(255,77,0,.08)}
        .su-input.err{border-color:#EF4444}

        /* Submit */
        .su-btn{
          width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
          background:linear-gradient(135deg,#f09433 0%,#dc2743 50%,#bc1888 100%);
          color:white;font-weight:700;font-size:16px;font-family:inherit;
          padding:16px;border-radius:14px;border:none;cursor:pointer;
          box-shadow:0 10px 32px rgba(255,77,0,.32);
          transition:all .2s cubic-bezier(.16,1,.3,1);
        }
        .su-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 42px rgba(255,77,0,.44)}
        .su-btn:disabled{opacity:.6;cursor:not-allowed}

        /* Password strength indicator */
        .pw-hint{font-size:12px;color:var(--text4);margin-top:6px}

        /* Animate in */
        .su-form-wrap{animation:suUp .55s cubic-bezier(.16,1,.3,1) both}
        @keyframes suUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        /* Grid for name/username */
        .su-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:480px){.su-2col{grid-template-columns:1fr}}
      `}</style>

      {/* ── Left panel ── */}
      <div className="su-left">
        <div className="su-dots" />
        <div className="su-glow" />

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
                width: 36,
                height: 36,
                borderRadius: 11,
                background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(220,39,67,.35)",
              }}
            >
              <Zap size={16} color="white" fill="white" />
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text1)",
                letterSpacing: "-0.02em",
              }}
            >
              BoostLink<span style={{ color: "#FF4D00" }}>Pro</span>
            </span>
          </Link>
        </div>

        {/* Middle */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "clamp(24px,2.8vw,36px)",
              fontWeight: 800,
              color: "var(--text1)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: 12,
            }}
          >
            Everything a creator
            <br />
            needs to grow.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text3)",
              lineHeight: 1.72,
              marginBottom: 32,
              maxWidth: 310,
            }}
          >
            Automate your Instagram, sell digital products, and grow your
            audience — all in one place.
          </p>

          {/* Perk list */}
          <div style={{ marginBottom: 32 }}>
            {perks.map((p) => (
              <div key={p} className="perk-item">
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(255,77,0,.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} color="#FF4D00" />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>

          {/* Free plan card */}
          <div className="free-card">
            <div className="free-card-accent" />
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text4)",
                marginBottom: 12,
              }}
            >
              Free plan includes
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 16px",
              }}
            >
              {freeIncludes.map((f) => (
                <div
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#FF4D00",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text2)",
                      fontWeight: 500,
                    }}
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--text4)",
                marginTop: 14,
                fontWeight: 600,
              }}
            >
              ✅ No credit card required
            </p>
          </div>
        </div>

        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 12,
            color: "var(--text4)",
          }}
        >
          © 2026 BoostLink Pro · All rights reserved
        </p>
      </div>

      {/* ── Right form ── */}
      <div className="su-right">
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
            <ArrowLeft size={15} /> Back
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ThemeToggle />
            <span style={{ fontSize: 14, color: "var(--text3)" }}>
              Have an account?{" "}
              <Link
                href="/auth/login"
                style={{
                  fontWeight: 700,
                  color: "#FF4D00",
                  textDecoration: "none",
                }}
              >
                Sign in
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
            padding: "24px 36px 40px",
          }}
        >
          <div
            className="su-form-wrap"
            style={{ width: "100%", maxWidth: 440 }}
          >
            {/* Mobile logo */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                textDecoration: "none",
                marginBottom: 28,
              }}
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
                fontSize: "clamp(24px,3.5vw,32px)",
                fontWeight: 800,
                color: "var(--text1)",
                letterSpacing: "-0.025em",
                marginBottom: 6,
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--text3)",
                marginBottom: 32,
                lineHeight: 1.5,
              }}
            >
              Free forever · Upgrade anytime · No credit card needed
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* Name + Username row */}
              <div className="su-2col">
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
                    Full name
                  </label>
                  <input
                    {...register("full_name")}
                    placeholder="Alex Johnson"
                    className={`su-input${errors.full_name ? " err" : ""}`}
                  />
                  {errors.full_name && (
                    <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
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
                    Username
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 15,
                        color: "var(--text3)",
                        pointerEvents: "none",
                      }}
                    >
                      @
                    </span>
                    <input
                      {...register("username")}
                      placeholder="alex"
                      className={`su-input${errors.username ? " err" : ""}`}
                      style={{ paddingLeft: 30 }}
                    />
                  </div>
                  {errors.username && (
                    <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

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
                  className={`su-input${errors.email ? " err" : ""}`}
                />
                {errors.email && (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    {...register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 characters"
                    className={`su-input${errors.password ? " err" : ""}`}
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
                {errors.password ? (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#EF4444" }}>
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="pw-hint">
                    Use letters, numbers and symbols for a strong password
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="su-btn"
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Creating account…
                  </>
                ) : (
                  "Create Free Account →"
                )}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "var(--text4)",
                marginTop: 20,
                lineHeight: 1.6,
              }}
            >
              By signing up you agree to our{" "}
              <Link
                href="/terms"
                style={{ color: "var(--text3)", textDecoration: "underline" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                style={{ color: "var(--text3)", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>
            </p>

            <p
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "var(--text3)",
                marginTop: 20,
              }}
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                style={{
                  fontWeight: 700,
                  color: "#FF4D00",
                  textDecoration: "none",
                }}
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
