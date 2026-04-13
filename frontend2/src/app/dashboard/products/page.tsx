"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Loader2,
  AlertCircle,
  DollarSign,
  Download,
  ToggleLeft,
  ToggleRight,
  FileText,
  Video,
  Music,
  BookOpen,
  Layout,
  Package,
} from "lucide-react";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: string;
  sales_count: number;
  file_url?: string;
  is_active: boolean;
  created_at: string;
};

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  pdf: {
    label: "PDF",
    icon: <FileText size={16} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
  video: {
    label: "Video",
    icon: <Video size={16} />,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
  },
  audio: {
    label: "Audio",
    icon: <Music size={16} />,
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.08)",
  },
  course: {
    label: "Course",
    icon: <BookOpen size={16} />,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
  },
  template: {
    label: "Template",
    icon: <Layout size={16} />,
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  other: {
    label: "Other",
    icon: <Package size={16} />,
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
  },
};

function fmtPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const EMPTY = { name: "", description: "", price: "", type: "pdf" };

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreateModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [active, setActive] = useState("");

  const canSave = !!form.name.trim() && parseFloat(form.price) > 0;

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append(
        "price_cents",
        String(Math.round(parseFloat(form.price) * 100)),
      );
      fd.append("type", form.type);
      if (file) fd.append("file", file);
      return api
        .post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created! 🎉");
      onClose();
    },
    onError: (e: any) => {
      console.error("Product creation error:", e);
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to create product";
      const details = e?.response?.data?.details;
      toast.error(errorMsg);
      if (details) {
        console.error("Error details:", details);
      }
    },
  });

  const inp = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 11,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    background: "#f9fafb",
    border: `1.5px solid ${active === field ? "#FF4D00" : "#e5e7eb"}`,
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: active === field ? "0 0 0 3px rgba(255,77,0,0.08)" : "none",
    transition: "all .15s",
  });

  function handleFile(f: File) {
    if (f.size > 500 * 1024 * 1024) {
      toast.error("File too large (max 500MB)");
      return;
    }
    setFile(f);
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          borderRadius: 22,
          border: "1.5px solid #e5e7eb",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#FF4D00,#FF7A00)",
            padding: "22px 26px 18px",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
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
              background: "rgba(255,255,255,0.07)",
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
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.65)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                New Product
              </p>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Add digital product
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 4,
                }}
              >
                Customer pays → gets download link automatically
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Type picker */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Product type
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setForm((p) => ({ ...p, type: k }))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 13px",
                    borderRadius: 9,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "1.5px solid",
                    transition: "all .15s",
                    borderColor: form.type === k ? v.color : "#e5e7eb",
                    background: form.type === k ? v.bg : "transparent",
                    color: form.type === k ? v.color : "#6b7280",
                  }}
                >
                  <span
                    style={{
                      color: form.type === k ? v.color : "#9ca3af",
                    }}
                  >
                    {v.icon}
                  </span>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 7,
              }}
            >
              Product name
            </label>
            <input
              style={inp("name")}
              placeholder="e.g. Instagram Growth Blueprint"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              onFocus={() => setActive("name")}
              onBlur={() => setActive("")}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 7,
              }}
            >
              Description
            </label>
            <textarea
              style={{
                ...inp("desc"),
                minHeight: 80,
                resize: "vertical" as const,
                lineHeight: 1.55,
              }}
              placeholder="What will the customer get?"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              onFocus={() => setActive("desc")}
              onBlur={() => setActive("")}
            />
          </div>

          {/* Price */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 7,
              }}
            >
              Price (USD)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#6b7280",
                }}
              >
                $
              </span>
              <input
                style={{ ...inp("price"), paddingLeft: 28 }}
                type="number"
                min="0.99"
                step="0.01"
                placeholder="9.99"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                onFocus={() => setActive("price")}
                onBlur={() => setActive("")}
              />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 7,
              }}
            >
              File{" "}
              <span
                style={{
                  fontWeight: 500,
                  textTransform: "none",
                  color: "#9ca3af",
                }}
              >
                — optional, add later
              </span>
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onClick={() => document.getElementById("pf-input")?.click()}
              style={{
                border: `2px dashed ${drag ? "#FF4D00" : "var(--c-border)"}`,
                borderRadius: 12,
                padding: "20px",
                textAlign: "center",
                background: drag ? "rgba(255,77,0,0.03)" : "var(--c-bg2)",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <input
                id="pf-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
              {file ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Download size={16} color="#FF4D00" />
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--c-text1)",
                        margin: 0,
                      }}
                    >
                      {file.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--c-text4)",
                        margin: 0,
                      }}
                    >
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--c-text4)",
                      display: "flex",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload
                    size={20}
                    color="var(--c-text4)"
                    style={{ margin: "0 auto 8px", display: "block" }}
                  />
                  <p
                    style={{ fontSize: 13, color: "var(--c-text3)", margin: 0 }}
                  >
                    Drag & drop or{" "}
                    <span style={{ color: "#FF4D00", fontWeight: 700 }}>
                      browse
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--c-text4)",
                      margin: "3px 0 0",
                    }}
                  >
                    PDF, MP4, ZIP — max 500MB
                  </p>
                </>
              )}
            </div>
          </div>

          {isError && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
                fontSize: 12,
                alignItems: "center",
              }}
            >
              <AlertCircle size={13} /> Something went wrong. Try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            gap: 10,
            padding: "14px 26px",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              background: "#ffffff",
              color: "#4b5563",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={!canSave || isPending}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: canSave ? "#FF4D00" : "#e5e7eb",
              color: canSave ? "white" : "#9ca3af",
              fontWeight: 700,
              fontSize: 13,
              cursor: canSave ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: canSave ? "0 4px 14px rgba(255,77,0,0.28)" : "none",
              transition: "all .15s",
            }}
          >
            {isPending && (
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
            )}{" "}
            Save Product
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product: p,
  onDelete,
}: {
  product: Product;
  onDelete: () => void;
}) {
  const [hov, setHov] = useState(false);
  const cfg = TYPE_CONFIG[p.type] ?? TYPE_CONFIG.other;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--c-card)",
        borderRadius: 18,
        border: `1.5px solid ${hov ? "var(--c-border2)" : "var(--c-border)"}`,
        boxShadow: hov ? "0 8px 28px rgba(0,0,0,0.08)" : "none",
        transition: "all .2s",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: cfg.color, opacity: 0.6 }} />
      <div style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: cfg.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 100,
                background: p.is_active
                  ? "rgba(16,185,129,0.1)"
                  : "var(--c-bg3)",
                color: p.is_active ? "#10B981" : "var(--c-text4)",
              }}
            >
              {p.is_active ? "Active" : "Inactive"}
            </span>
            <button
              onClick={onDelete}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--c-text4)",
                display: "flex",
                padding: 4,
                transition: "color .15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#EF4444")}
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "var(--c-text4)")
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--c-text1)",
            margin: "0 0 5px",
            lineHeight: 1.3,
          }}
        >
          {p.name}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--c-text3)",
            margin: "0 0 16px",
            lineHeight: 1.5,
            minHeight: 36,
          }}
        >
          {p.description || "No description"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>
            {fmtPrice(p.price_cents)}
          </span>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--c-text1)",
                margin: 0,
              }}
            >
              {p.sales_count}
            </p>
            <p style={{ fontSize: 10, color: "var(--c-text4)", margin: 0 }}>
              sales
            </p>
          </div>
        </div>
        <button
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: 10,
            border: "1.5px solid var(--c-border)",
            background: "var(--c-bg2)",
            color: "var(--c-text2)",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <ExternalLink size={12} /> View checkout
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["products"],
    queryFn: () => api.get("/api/products").then((r) => r.data),
  });
  const products: Product[] = data?.data ?? [];

  const deleteM = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const totalRev = products.reduce(
    (s, p) => s + p.sales_count * p.price_cents,
    0,
  );
  const totalSales = products.reduce((s, p) => s + p.sales_count, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {creating && <CreateModal onClose={() => setCreating(false)} />}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
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
            Digital Products
          </h1>
          <p
            style={{ fontSize: 13, color: "var(--c-text3)", margin: "4px 0 0" }}
          >
            Upload once, sell forever — instant delivery via Stripe
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: 12,
            background: "#FF4D00",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(255,77,0,0.28)",
          }}
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Products",
            value: String(products.length),
            icon: <Package size={18} />,
            color: "#FF4D00",
            bg: "rgba(255,77,0,0.08)",
          },
          {
            label: "Total Sales",
            value: String(totalSales),
            icon: <ShoppingBag size={18} />,
            color: "#10B981",
            bg: "rgba(16,185,129,0.08)",
          },
          {
            label: "Revenue",
            value: fmtPrice(totalRev),
            icon: <DollarSign size={18} />,
            color: "#8B5CF6",
            bg: "rgba(139,92,246,0.08)",
          },
        ].map((s) => (
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
                marginBottom: 12,
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--c-text1)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--c-text3)",
                margin: "3px 0 0",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Content */}
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
      ) : products.length === 0 ? (
        <div
          style={{
            background: "var(--c-card)",
            border: "1.5px dashed var(--c-border2)",
            borderRadius: 20,
            padding: "56px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(16,185,129,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <ShoppingBag size={24} color="#10B981" />
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--c-text1)",
              margin: "0 0 8px",
            }}
          >
            No products yet
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--c-text3)",
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            Upload a PDF, course, or template. Customers pay and get instant
            access.
          </p>
          <button
            onClick={() => setCreating(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 700,
              padding: "11px 22px",
              borderRadius: 12,
              background: "#10B981",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={15} /> Add first product
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
            gap: 14,
          }}
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onDelete={() => deleteM.mutate(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
