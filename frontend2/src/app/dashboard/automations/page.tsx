"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Zap,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
  Film,
  ImageIcon,
  Loader2,
  AlertCircle,
  Pencil,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Post = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REEL";
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};
type Automation = {
  id: string;
  name: string;
  keywords: string[];
  dm_message: string;
  comment_reply: string;
  follow_condition: boolean;
  post_ids: string[];
  is_active: boolean;
  dms_sent?: number;
  created_at: string;
};

const EMPTY = {
  name: "",
  keywords: [] as string[],
  dm_message: "",
  comment_reply: "",
  follow_condition: false,
};

export default function AutomationsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [kwInput, setKwInput] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postTarget, setPostTarget] = useState<"any" | "specific">("any");
  const [form, setForm] = useState(EMPTY);
  const [activeField, setActiveField] = useState<string | null>(null);

  const { data: autoData, isLoading } = useQuery({
    queryKey: ["automations"],
    queryFn: () => api.get("/api/automations").then((r) => r.data),
  });
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["ig-posts"],
    queryFn: () => api.get("/api/instagram/posts").then((r) => r.data),
    retry: false,
  });
  const { data: igData } = useQuery({
    queryKey: ["ig"],
    queryFn: () => api.get("/api/instagram/account").then((r) => r.data),
  });

  const automations: Automation[] = autoData?.data ?? [];
  const posts: Post[] = postsData?.data ?? [];
  const igConnected = !!igData?.data?.is_connected;

  const createM = useMutation({
    mutationFn: (b: object) =>
      api.post("/api/automations", b).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automations"] });
      close_();
    },
  });
  const updateM = useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      api.put(`/api/automations/${id}`, body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automations"] });
      close_();
    },
  });
  const toggleM = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/automations/${id}/toggle`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["automations"] }),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/automations/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["automations"] }),
  });

  function close_() {
    setOpen(false);
    setEditId(null);
    setForm(EMPTY);
    setKwInput("");
    setSelectedPosts([]);
    setPostTarget("any");
  }
  function addKw() {
    const kw = kwInput.trim().toLowerCase();
    if (!kw || form.keywords.includes(kw)) return;
    setForm((p) => ({ ...p, keywords: [...p.keywords, kw] }));
    setKwInput("");
  }
  function openEdit(a: Automation) {
    setForm({
      name: a.name,
      keywords: a.keywords,
      dm_message: a.dm_message,
      comment_reply: a.comment_reply,
      follow_condition: a.follow_condition,
    });
    setSelectedPosts(a.post_ids);
    setPostTarget(a.post_ids.length > 0 ? "specific" : "any");
    setEditId(a.id);
    setOpen(true);
  }
  function submit() {
    if (!form.name.trim() || !form.keywords.length || !form.dm_message.trim())
      return;
    const body = {
      ...form,
      post_ids: postTarget === "specific" ? selectedPosts : [],
    };
    editId ? updateM.mutate({ id: editId, body }) : createM.mutate(body);
  }

  const busy = createM.isPending || updateM.isPending;
  const canSubmit = !!(
    form.name.trim() &&
    form.keywords.length &&
    form.dm_message.trim()
  );

  // ── Input style — uses correct CSS vars from globals.css ──────────────────
  const inp = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    background: "var(--bg)", // ✅ was --c-bg
    border: `1.5px solid ${activeField === field ? "#FF4D00" : "var(--border2)"}`, // ✅ was --c-border2
    color: "var(--text1)", // ✅ was --c-text1
    outline: "none",
    boxShadow: activeField === field ? "0 0 0 3px rgba(255,77,0,0.08)" : "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  /* ── MODAL ───────────────────────────────────────────────────────────────── */
  const modal =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            background: "var(--card)", // ✅ was --c-card
            borderRadius: 20,
            border: "1px solid var(--border)", // ✅ was --c-border
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #FF4D00 0%, #FF7A00 100%)",
              padding: "24px 28px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                right: 40,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <Zap
                    size={15}
                    color="rgba(255,255,255,0.8)"
                    fill="rgba(255,255,255,0.8)"
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {editId ? "Edit Automation" : "New Automation"}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {editId ? "Update keyword trigger" : "Create keyword trigger"}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 5,
                  }}
                >
                  Comment detected → DM sent automatically
                </p>
              </div>
              <button
                onClick={close_}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              background: "var(--card)", // ✅ explicit bg so it never goes transparent
            }}
          >
            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Automation name
              </label>
              <input
                style={inp("name")}
                placeholder='e.g. "Price inquiry DM"'
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                onFocus={() => setActiveField("name")}
                onBlur={() => setActiveField(null)}
              />
            </div>

            {/* Keywords */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Trigger keywords
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...inp("kw"), flex: 1 }}
                  placeholder='Type a keyword + press Enter (e.g. "price")'
                  value={kwInput}
                  onChange={(e) => setKwInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKw();
                    }
                  }}
                  onFocus={() => setActiveField("kw")}
                  onBlur={() => setActiveField(null)}
                />
                <button
                  onClick={addKw}
                  style={{
                    flexShrink: 0,
                    padding: "0 18px",
                    borderRadius: 10,
                    border: "none",
                    background: "#FF4D00",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Add
                </button>
              </div>
              {form.keywords.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 2,
                  }}
                >
                  {form.keywords.map((kw) => (
                    <span
                      key={kw}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px 4px 12px",
                        borderRadius: 100,
                        background: "rgba(255,77,0,0.1)",
                        color: "#FF4D00",
                        fontSize: 12,
                        fontWeight: 700,
                        border: "1px solid rgba(255,77,0,0.2)",
                      }}
                    >
                      {kw}
                      <button
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            keywords: p.keywords.filter((k) => k !== kw),
                          }))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#FF4D00",
                          padding: 0,
                          display: "flex",
                          marginLeft: 2,
                        }}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 12, color: "var(--text3)" }}>
                {" "}
                {/* ✅ was --c-text3 */}
                Anyone who comments any of these words will get your DM
              </p>
            </div>

            {/* DM Message */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  DM message
                </label>
                <span
                  style={{
                    fontSize: 11,
                    color: "#FF4D00",
                    fontWeight: 600,
                    background: "rgba(255,77,0,0.08)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,77,0,0.15)",
                  }}
                >
                  Use {"{{first_name}}"} to personalise
                </span>
              </div>
              <textarea
                style={{ ...inp("dm"), resize: "none", lineHeight: 1.65 }}
                rows={4}
                placeholder={
                  "Hey {{first_name}}! 👋\nThanks for commenting. Here's what you asked for:\n..."
                }
                value={form.dm_message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dm_message: e.target.value }))
                }
                onFocus={() => setActiveField("dm")}
                onBlur={() => setActiveField(null)}
              />
            </div>

            {/* Comment reply */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Public reply
                </label>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    background: "var(--bg3)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  optional
                </span>
              </div>
              <input
                style={inp("reply")}
                placeholder='e.g. "Sent you a DM with the details! 📩"'
                value={form.comment_reply}
                onChange={(e) =>
                  setForm((p) => ({ ...p, comment_reply: e.target.value }))
                }
                onFocus={() => setActiveField("reply")}
                onBlur={() => setActiveField(null)}
              />
              <p style={{ fontSize: 12, color: "var(--text3)" }}>
                Publicly reply to their comment before sending the DM
              </p>
            </div>

            {/* Post target */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Apply to
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {(["any", "specific"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPostTarget(opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 16px",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      border: `1.5px solid ${postTarget === opt ? "#FF4D00" : "var(--border2)"}`,
                      background:
                        postTarget === opt
                          ? "rgba(255,77,0,0.08)"
                          : "var(--bg2)", // ✅ was #FFF3EE / --c-bg
                      color: postTarget === opt ? "#FF4D00" : "var(--text2)", // ✅ was --c-text2
                      transition: "all 0.15s",
                    }}
                  >
                    <span>{opt === "any" ? "🌐" : "🎯"}</span>
                    {opt === "any" ? "All posts" : "Specific posts"}
                  </button>
                ))}
              </div>

              {postTarget === "specific" && (
                <div style={{ marginTop: 4 }}>
                  {postsLoading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "28px 0",
                        color: "var(--text3)",
                      }}
                    >
                      <Loader2
                        size={18}
                        style={{
                          color: "#FF4D00",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <span style={{ fontSize: 13 }}>Loading posts…</span>
                    </div>
                  ) : posts.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        padding: "20px 0",
                        fontSize: 13,
                        color: "var(--text3)",
                      }}
                    >
                      No posts found. Connect Instagram first.
                    </p>
                  ) : (
                    <div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5,1fr)",
                          gap: 6,
                        }}
                      >
                        {posts.map((post) => {
                          const sel = selectedPosts.includes(post.id);
                          return (
                            <button
                              key={post.id}
                              onClick={() =>
                                setSelectedPosts((p) =>
                                  p.includes(post.id)
                                    ? p.filter((x) => x !== post.id)
                                    : [...p, post.id],
                                )
                              }
                              style={{
                                position: "relative",
                                borderRadius: 8,
                                overflow: "hidden",
                                aspectRatio: "1",
                                background: "var(--bg3)",
                                cursor: "pointer",
                                border: "none",
                                padding: 0,
                                outline: sel
                                  ? "2.5px solid #FF4D00"
                                  : "2px solid transparent",
                                outlineOffset: 2,
                              }}
                            >
                              {post.thumbnail_url ? (
                                <img
                                  src={post.thumbnail_url}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {post.media_type === "REEL" ||
                                  post.media_type === "VIDEO" ? (
                                    <Film size={14} color="var(--text4)" />
                                  ) : (
                                    <ImageIcon size={14} color="var(--text4)" />
                                  )}
                                </div>
                              )}
                              {sel && (
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(255,77,0,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      background: "#FF4D00",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 11,
                                      fontWeight: 900,
                                    }}
                                  >
                                    ✓
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {selectedPosts.length > 0 && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#FF4D00",
                            fontWeight: 600,
                            marginTop: 8,
                          }}
                        >
                          ✓ {selectedPosts.length} post
                          {selectedPosts.length > 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {(createM.isError || updateM.isError) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  fontSize: 12,
                }}
              >
                <AlertCircle size={13} /> Something went wrong. Please try
                again.
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              gap: 10,
              padding: "16px 28px",
              borderTop: "1px solid var(--border)", // ✅ was --c-border
              background: "var(--bg2)", // ✅ was --c-bg2
            }}
          >
            <button
              onClick={close_}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                border: "1.5px solid var(--border2)",
                background: "var(--card)",
                color: "var(--text2)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={busy || !canSubmit}
              style={{
                flex: 2,
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: canSubmit && !busy ? "#FF4D00" : "var(--bg3)",
                color: canSubmit && !busy ? "white" : "var(--text4)",
                fontSize: 13,
                fontWeight: 700,
                cursor: canSubmit && !busy ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow:
                  canSubmit && !busy ? "0 4px 14px rgba(255,77,0,0.3)" : "none",
                transition: "all 0.15s",
              }}
            >
              {busy && (
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              {editId ? "Save Changes" : "Create Automation"}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  /* ── PAGE ─────────────────────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      {modal}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text1)",
              letterSpacing: "-0.03em",
              marginBottom: 4,
            }}
          >
            Automations
          </h1>
          <p style={{ fontSize: 14, color: "var(--text3)" }}>
            Keyword triggers that send DMs to commenters automatically
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 12,
            border: "none",
            background: "#FF4D00",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 18px rgba(255,77,0,0.35)",
          }}
        >
          <Plus size={15} /> New Automation
        </button>
      </div>

      {/* How it works banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
          marginBottom: 28,
        }}
      >
        {[
          { emoji: "💬", label: "Someone comments your keyword" },
          { emoji: "⚡", label: "BoostLink Pro detects it instantly" },
          { emoji: "📩", label: "Your DM fires automatically" },
        ].map(({ emoji, label }, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: "var(--card)",
              borderRight: i < 2 ? "1px solid var(--border)" : "none",
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text2)",
                lineHeight: 1.4,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Not connected warning */}
      {!igConnected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 12,
            marginBottom: 20,
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <AlertCircle size={15} style={{ color: "#8b5cf6", flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "var(--text2)", flex: 1 }}>
            Connect your Instagram Business account to activate automations.
          </p>
          <a
            href="/dashboard/settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: "#8b5cf6",
              textDecoration: "none",
            }}
          >
            Connect <ChevronRight size={12} />
          </a>
        </div>
      )}

      {/* Automations list */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "72px 0",
          }}
        >
          <Loader2
            size={22}
            style={{ color: "#FF4D00", animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : automations.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "64px 24px",
            borderRadius: 20,
            background: "var(--card)",
            border: "1.5px dashed var(--border2)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              marginBottom: 20,
              background:
                "linear-gradient(135deg,rgba(255,77,0,0.1),rgba(255,77,0,0.05))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(255,77,0,0.12)",
            }}
          >
            <Sparkles size={26} color="#FF4D00" />
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text1)",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            No automations yet
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text3)",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 320,
              marginBottom: 28,
            }}
          >
            Create your first keyword trigger and start converting commenters
            into customers — hands free.
          </p>
          <button
            onClick={() => setOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 24px",
              borderRadius: 12,
              border: "none",
              background: "#FF4D00",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 18px rgba(255,77,0,0.3)",
            }}
          >
            <Plus size={15} /> Create first automation
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {automations.map((a) => (
            <AutomationCard
              key={a.id}
              automation={a}
              onEdit={() => openEdit(a)}
              onToggle={() => toggleM.mutate(a.id)}
              onDelete={() => deleteM.mutate(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AutomationCard({
  automation: a,
  onEdit,
  onToggle,
  onDelete,
}: {
  automation: Automation;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 20px",
        borderRadius: 16,
        background: "var(--card)",
        border: `1px solid ${hov ? "var(--border2)" : "var(--border)"}`,
        boxShadow: hov ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.18s",
      }}
    >
      {/* Icon */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: a.is_active
              ? "linear-gradient(135deg,rgba(255,77,0,0.12),rgba(255,77,0,0.06))"
              : "var(--bg2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle
            size={19}
            color={a.is_active ? "#FF4D00" : "var(--text4)"}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: a.is_active ? "#10b981" : "var(--border2)",
            border: "2px solid var(--card)",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text1)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {a.name}
          </span>
          <span
            style={{
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 100,
              background: a.is_active ? "rgba(16,185,129,0.1)" : "var(--bg3)",
              color: a.is_active ? "#10b981" : "var(--text4)",
            }}
          >
            {a.is_active ? "Active" : "Paused"}
          </span>
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}
        >
          {a.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 100,
                background: "rgba(255,77,0,0.08)",
                color: "#FF4D00",
              }}
            >
              "{kw}"
            </span>
          ))}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "var(--text3)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {a.dm_message}
        </p>
        {a.post_ids.length > 0 && (
          <p style={{ fontSize: 11, color: "var(--text4)", marginTop: 2 }}>
            🎯 {a.post_ids.length} specific post
            {a.post_ids.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* DMs stat */}
      <div style={{ textAlign: "right", flexShrink: 0, marginRight: 12 }}>
        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--text1)",
            lineHeight: 1,
          }}
        >
          {a.dms_sent ?? 0}
        </p>
        <p
          style={{
            fontSize: 10,
            color: "var(--text4)",
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          DMs sent
        </p>
      </div>

      {/* Action buttons — visible on hover */}
      <div
        style={{
          display: "flex",
          gap: 2,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      >
        {[
          {
            icon: <Pencil size={13} />,
            label: "Edit",
            fn: onEdit,
            color: "var(--text3)",
          },
          {
            icon: a.is_active ? (
              <ToggleRight size={19} />
            ) : (
              <ToggleLeft size={19} />
            ),
            label: a.is_active ? "Pause" : "Enable",
            fn: onToggle,
            color: a.is_active ? "#10b981" : "var(--text3)",
          },
          {
            icon: <Trash2 size={13} />,
            label: "Delete",
            fn: onDelete,
            color: "#ef4444",
          },
        ].map(({ icon, label, fn, color }) => (
          <button
            key={label}
            onClick={fn}
            title={label}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
