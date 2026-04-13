"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Instagram,
  Check,
  ExternalLink,
  Copy,
  LogOut,
  Trash2,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
  User,
  Link2,
  Shield,
  CreditCard,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cardStyle, inputStyle } from "../_shared";

function buildOAuthURL() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`;
  const scope = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
  ].join(",");
  const state = encodeURIComponent(JSON.stringify({ cb: "instagram" }));
  return `https://www.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;
}

// ── Delete Account Modal ─────────────────────────────────────────────────────
function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const { logout } = useAuthStore();
  const [step, setStep] = useState<"confirm" | "typing" | "deleting">(
    "confirm",
  );
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const CONFIRM_PHRASE = "delete my account";

  useEffect(() => {
    if (step === "typing") setTimeout(() => inputRef.current?.focus(), 50);
  }, [step]);

  const deleteMutation = useMutation({
    mutationFn: () => api.delete("/api/account").then((r) => r.data),
    onSuccess: () => {
      toast.success("Account deleted. Goodbye 👋");
      logout();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to delete account. Try again.",
      );
      setStep("typing");
    },
  });

  function handleDelete() {
    if (inputVal.trim().toLowerCase() !== CONFIRM_PHRASE) return;
    setStep("deleting");
    deleteMutation.mutate();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--c-card)",
          borderRadius: 20,
          border: "1.5px solid rgba(239,68,68,0.3)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.04) 100%)",
            borderBottom: "1px solid rgba(239,68,68,0.15)",
            padding: "24px 28px 20px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} color="#EF4444" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--c-text1)",
                  margin: 0,
                }}
              >
                Delete Account
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-text3)",
                  margin: "3px 0 0",
                }}
              >
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--c-text3)",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {step === "confirm" && (
            <>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--c-text2)",
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                Deleting your account will permanently remove:
              </p>
              <ul
                style={{
                  margin: "0 0 24px",
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "All your automations and keyword triggers",
                  "Your digital products and sales history",
                  "Your Instagram connection and tokens",
                  "Your bio link page",
                  "All analytics data",
                  "Your account credentials",
                ].map((item) => (
                  <li
                    key={item}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "rgba(239,68,68,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <X size={9} color="#EF4444" />
                    </div>
                    <span style={{ fontSize: 13, color: "var(--c-text2)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "1.5px solid var(--c-border)",
                    background: "var(--c-bg2)",
                    color: "var(--c-text2)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("typing")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: "rgba(239,68,68,0.1)",
                    color: "#EF4444",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {(step === "typing" || step === "deleting") && (
            <>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--c-text2)",
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                To confirm, type{" "}
                <strong style={{ color: "#EF4444" }}>{CONFIRM_PHRASE}</strong>{" "}
                in the box below:
              </p>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                disabled={step === "deleting"}
                style={{
                  ...inputStyle,
                  marginBottom: 20,
                  fontSize: 14,
                  borderColor:
                    inputVal && inputVal.toLowerCase() !== CONFIRM_PHRASE
                      ? "#EF4444"
                      : "var(--c-border)",
                  boxShadow:
                    inputVal.toLowerCase() === CONFIRM_PHRASE
                      ? "0 0 0 3px rgba(239,68,68,0.12)"
                      : "none",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onClose}
                  disabled={step === "deleting"}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "1.5px solid var(--c-border)",
                    background: "var(--c-bg2)",
                    color: "var(--c-text2)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={
                    inputVal.trim().toLowerCase() !== CONFIRM_PHRASE ||
                    step === "deleting"
                  }
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background:
                      inputVal.trim().toLowerCase() === CONFIRM_PHRASE
                        ? "#EF4444"
                        : "var(--c-bg3)",
                    color:
                      inputVal.trim().toLowerCase() === CONFIRM_PHRASE
                        ? "white"
                        : "var(--c-text4)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor:
                      inputVal.trim().toLowerCase() === CONFIRM_PHRASE
                        ? "pointer"
                        : "not-allowed",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.15s",
                  }}
                >
                  {step === "deleting" ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} /> Delete Forever
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Page ───────────────────────────────────────────────────────
function SettingsPageContent() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const params = useSearchParams();

  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    username: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const uname = user?.user_metadata?.username as string | undefined;
  const name = user?.user_metadata?.full_name as string | undefined;

  // Seed profile form from user metadata
  useEffect(() => {
    setProfileForm({ full_name: name ?? "", username: uname ?? "" });
  }, [name, uname]);

  // Fetch connected IG account
  const { data: ig, isLoading: igLoading } = useQuery<any>({
    queryKey: ["ig"],
    queryFn: () => api.get("/api/instagram/account").then((r) => r.data.data),
    retry: false,
  });

  // Handle OAuth callback
  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) return;

    let parsed: any = {};
    try {
      parsed = JSON.parse(decodeURIComponent(state));
    } catch {}
    if (parsed.cb !== "instagram") return;

    setConnecting(true);
    window.history.replaceState({}, "", "/dashboard/settings");

    api
      .get(`/api/instagram/auth/callback?code=${code}`)
      .then(() => {
        qc.invalidateQueries({ queryKey: ["ig"] });
        toast.success("🎉 Instagram connected successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to connect Instagram. Please try again.");
      })
      .finally(() => setConnecting(false));
  }, [params, qc]);

  // Disconnect Instagram
  const disconnect = useMutation({
    mutationFn: () => api.delete("/api/instagram/disconnect"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ig"] });
      toast.success("Instagram disconnected");
    },
    onError: () => toast.error("Failed to disconnect"),
  });

  // Save profile
  async function saveProfile() {
    if (!profileForm.full_name.trim() || !profileForm.username.trim()) return;
    setSavingProfile(true);
    try {
      await api.patch("/api/account/profile", profileForm);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://boostlinkpro.com/${uname ?? ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sectionHeader = (icon: React.ReactNode, title: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 18,
      }}
    >
      {icon}
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--c-text1)",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {showDelete && (
        <DeleteAccountModal onClose={() => setShowDelete(false)} />
      )}

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--c-text1)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: 13, color: "var(--c-text3)", margin: "4px 0 0" }}>
          Manage your account, connections and billing
        </p>
      </div>

      {/* ── Instagram Connection ──────────────────────────────────────── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {sectionHeader(
          <Instagram size={16} color="#FF4D00" />,
          "Instagram Connection",
        )}

        {/* Loading / Connecting */}
        {(igLoading || connecting) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px",
              borderRadius: 14,
              background: "var(--c-bg2)",
              border: "1.5px solid var(--c-border)",
            }}
          >
            <Loader2
              size={20}
              color="#FF4D00"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p
              style={{
                fontSize: 13,
                color: "var(--c-text2)",
                margin: 0,
                fontWeight: 600,
              }}
            >
              {connecting
                ? "Connecting your Instagram account…"
                : "Checking connection…"}
            </p>
          </div>
        )}

        {/* Connected */}
        {!igLoading && !connecting && ig && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 20px",
                borderRadius: 14,
                background: "rgba(16,185,129,0.05)",
                border: "1.5px solid rgba(16,185,129,0.2)",
                marginBottom: 14,
              }}
            >
              {ig.profile_picture_url ? (
                <img
                  src={ig.profile_picture_url}
                  alt={ig.username}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "2px solid rgba(16,185,129,0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Instagram size={22} color="#10B981" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--c-text1)",
                      margin: 0,
                    }}
                  >
                    @{ig.username}
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 100,
                      background: "rgba(16,185,129,0.12)",
                      color: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Check size={9} /> Connected
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--c-text3)", margin: 0 }}>
                  {ig.name} ·{" "}
                  {ig.followers_count?.toLocaleString("en-US") ?? "—"} followers
                </p>
                {ig.connected_at && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--c-text4)",
                      margin: "3px 0 0",
                    }}
                  >
                    Connected{" "}
                    {new Date(ig.connected_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {ig.token_expires_at &&
                      ` · Token expires ${new Date(ig.token_expires_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`}
                  </p>
                )}
              </div>
              <button
                onClick={() => disconnect.mutate()}
                disabled={disconnect.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "transparent",
                  border: "1.5px solid rgba(239,68,68,0.25)",
                  color: "#EF4444",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                {disconnect.isPending ? (
                  <Loader2
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <LogOut size={13} />
                )}
                Disconnect
              </button>
            </div>

            {/* Token expiry warning */}
            {ig.token_expires_at &&
              new Date(ig.token_expires_at) <
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 11,
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.25)",
                  }}
                >
                  <AlertCircle size={15} color="#F59E0B" />
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--c-text2)",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    Your token expires soon. Reconnect to keep automations
                    running.
                  </p>
                  <a
                    href={buildOAuthURL()}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#F59E0B",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Reconnect <ChevronRight size={12} />
                  </a>
                </div>
              )}
          </div>
        )}

        {/* Not connected */}
        {!igLoading && !connecting && !ig && (
          <div>
            <div
              style={{
                padding: "24px",
                borderRadius: 14,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, rgba(255,77,0,0.05) 0%, rgba(255,140,0,0.04) 100%)",
                border: "1.5px dashed rgba(255,77,0,0.25)",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(255,77,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <Instagram size={24} color="#FF4D00" />
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--c-text1)",
                  margin: "0 0 6px",
                }}
              >
                No Instagram connected
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--c-text3)",
                  margin: "0 0 20px",
                  lineHeight: 1.6,
                }}
              >
                Connect your Instagram Business or Creator account
                <br />
                to enable automated DMs and comment triggers.
              </p>
              <a
                href={buildOAuthURL()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  borderRadius: 13,
                  background: "#FF4D00",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(255,77,0,0.30)",
                }}
              >
                <Instagram size={16} /> Connect Instagram
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--c-text4)",
                  margin: "0 0 4px",
                }}
              >
                Requirements
              </p>
              {[
                "Instagram Professional account (Business or Creator)",
                "Account must be public (not private)",
                "You must be an admin of your Instagram Page",
              ].map((r) => (
                <div
                  key={r}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(255,77,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Check size={9} color="#FF4D00" />
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--c-text3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {r}
                  </span>
                </div>
              ))}
              <a
                href="https://help.instagram.com/502981923235522"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: "#FF4D00",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                How to switch to a Professional account{" "}
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Bio Link ─────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {sectionHeader(<Link2 size={16} color="#FF4D00" />, "Your Bio Link")}
        <p
          style={{
            fontSize: 13,
            color: "var(--c-text3)",
            margin: "0 0 14px",
          }}
        >
          Share this in your Instagram bio. Visitors see all your links and
          products.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: 11,
              background: "var(--c-bg2)",
              border: "1.5px solid var(--c-border)",
              fontSize: 13,
              color: "var(--c-text3)",
              display: "flex",
              alignItems: "center",
            }}
          >
            🔗 boostlinkpro.com/{uname ?? "yourname"}
          </div>
          <button
            onClick={copyLink}
            style={{
              padding: "11px 18px",
              borderRadius: 11,
              background: copied ? "#10B981" : "var(--c-bg2)",
              border: "1.5px solid var(--c-border)",
              color: copied ? "white" : "var(--c-text2)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
          <a
            href={`https://boostlinkpro.com/${uname ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0 14px",
              borderRadius: 11,
              background: "var(--c-bg2)",
              border: "1.5px solid var(--c-border)",
              color: "var(--c-text2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* ── Profile ──────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {sectionHeader(<User size={16} color="#FF4D00" />, "Profile")}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--c-text2)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Full name
              </label>
              <input
                style={inputStyle}
                placeholder="Your name"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, full_name: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--c-text2)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Username
              </label>
              <input
                style={inputStyle}
                placeholder="yourname"
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    username: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ""),
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--c-text2)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              style={{ ...inputStyle, color: "var(--c-text3)" }}
              value={user?.email ?? ""}
              readOnly
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 22px",
              borderRadius: 11,
              background: "#FF4D00",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              opacity: savingProfile ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {savingProfile && (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            )}
            Save changes
          </button>
        </div>
      </div>

      {/* ── Plan & Billing ───────────────────────────────────────────── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {sectionHeader(
          <CreditCard size={16} color="#FF4D00" />,
          "Plan & Billing",
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderRadius: 13,
            background: "var(--c-bg2)",
            border: "1px solid var(--c-border)",
            marginBottom: 14,
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
              Free Plan
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--c-text3)",
                margin: "3px 0 0",
              }}
            >
              3 automations · 100 DMs/month · 1 product
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 100,
              background: "rgba(255,77,0,0.08)",
              color: "#FF4D00",
            }}
          >
            Active
          </span>
        </div>
        <button
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 13,
            background: "linear-gradient(135deg,#FF4D00,#FF7A3D)",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(255,77,0,0.28)",
          }}
        >
          ⚡ Upgrade to Pro — $19/month
        </button>
        <p
          style={{
            fontSize: 11,
            color: "var(--c-text4)",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Billed via Stripe · Cancel anytime
        </p>
      </div>

      {/* ── Danger Zone ──────────────────────────────────────────────── */}
      <div
        style={{
          ...cardStyle,
          border: "1.5px solid rgba(239,68,68,0.2)",
          background: "rgba(239,68,68,0.02)",
          marginBottom: 0,
        }}
      >
        {sectionHeader(<Shield size={16} color="#EF4444" />, "Danger Zone")}

        <p
          style={{
            fontSize: 13,
            color: "var(--c-text3)",
            margin: "0 0 20px",
            lineHeight: 1.65,
          }}
        >
          Deleting your account is permanent. All your automations, products,
          analytics data, and your Instagram connection will be removed
          immediately. This meets Meta's data deletion requirements.
        </p>

        {/* Two danger actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Export data first (good practice) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: 12,
              background: "var(--c-bg2)",
              border: "1px solid var(--c-border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--c-text1)",
                  margin: 0,
                }}
              >
                Export my data
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-text3)",
                  margin: "3px 0 0",
                }}
              >
                Download a copy of all your data before deleting
              </p>
            </div>
            <button
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                background: "var(--c-bg3)",
                border: "1.5px solid var(--c-border)",
                color: "var(--c-text2)",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Export
            </button>
          </div>

          {/* Delete account */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.04)",
              border: "1.5px solid rgba(239,68,68,0.18)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#EF4444",
                  margin: 0,
                }}
              >
                Delete my account
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-text3)",
                  margin: "3px 0 0",
                }}
              >
                Permanently delete all data — cannot be undone
              </p>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1.5px solid rgba(239,68,68,0.25)",
                color: "#EF4444",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export with Suspense Boundary ────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2
            size={24}
            style={{
              animation: "spin 1s linear infinite",
              color: "var(--c-text3)",
            }}
          />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
