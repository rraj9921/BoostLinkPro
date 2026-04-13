"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Link2,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  ShoppingBag,
  Instagram as InstagramIcon,
  Globe,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import { cardStyle, inputStyle } from "../_shared";
import type { BioLink } from "@/types";

const LINK_TYPES = [
  { value: "link", label: "Website Link", icon: Globe },
  { value: "social", label: "Social Media", icon: InstagramIcon },
  { value: "product", label: "Product", icon: ShoppingBag },
  { value: "amazon", label: "Amazon", icon: ExternalLink },
  { value: "myntra", label: "Myntra", icon: ExternalLink },
] as const;

export default function BioLinksPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "link" as BioLink["type"],
  });

  const { data: links = [], isLoading } = useQuery<BioLink[]>({
    queryKey: ["bioLinks"],
    queryFn: () => api.get("/api/bio-links").then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      api.post("/api/bio-links", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bioLinks"] });
      toast.success("Link added!");
      closeModal();
    },
    onError: () => toast.error("Failed to add link"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<BioLink> & { id: string }) =>
      api.patch(`/api/bio-links/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bioLinks"] });
      toast.success("Link updated!");
      closeModal();
    },
    onError: () => toast.error("Failed to update link"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/bio-links/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bioLinks"] });
      toast.success("Link deleted");
    },
    onError: () => toast.error("Failed to delete link"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/bio-links/${id}/toggle`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bioLinks"] });
    },
    onError: () => toast.error("Failed to toggle link"),
  });

  function openModal(link?: BioLink) {
    if (link) {
      setEditingLink(link);
      setFormData({ title: link.title, url: link.url, type: link.type });
    } else {
      setEditingLink(null);
      setFormData({ title: "", url: "", type: "link" });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingLink(null);
    setFormData({ title: "", url: "", type: "link" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--c-text1)",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Bio Links
          </h1>
          <button
            onClick={() => openModal()}
            style={{
              padding: "10px 18px",
              borderRadius: 11,
              border: "none",
              background:
                "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 12px rgba(240,148,51,0.25)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(240,148,51,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(240,148,51,0.25)";
            }}
          >
            <Plus size={16} /> Add Link
          </button>
        </div>
        <p style={{ fontSize: 14, color: "var(--c-text3)", margin: 0 }}>
          Manage the links that appear on your public bio page
        </p>
      </div>

      {/* Links List */}
      {isLoading ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--c-text3)" }}>Loading...</p>
        </div>
      ) : links.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
          <Link2
            size={48}
            style={{ color: "var(--c-text4)", margin: "0 auto 16px" }}
          />
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--c-text2)",
              margin: "0 0 8px",
            }}
          >
            No links yet
          </h3>
          <p
            style={{ fontSize: 14, color: "var(--c-text3)", marginBottom: 20 }}
          >
            Add your first link to start building your bio page
          </p>
          <button
            onClick={() => openModal()}
            style={{
              padding: "10px 20px",
              borderRadius: 11,
              border: "1.5px solid var(--c-border)",
              background: "var(--c-bg2)",
              color: "var(--c-text2)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Add your first link
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {links.map((link) => {
            const LinkIcon =
              LINK_TYPES.find((t) => t.value === link.type)?.icon || Globe;
            return (
              <div
                key={link.id}
                style={{
                  ...cardStyle,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: link.is_active ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                <GripVertical
                  size={18}
                  style={{ color: "var(--c-text4)", cursor: "grab" }}
                />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--c-bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LinkIcon size={18} style={{ color: "var(--c-text2)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--c-text1)",
                      margin: "0 0 4px",
                    }}
                  >
                    {link.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--c-text3)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.url}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleMutation.mutate(link.id)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "none",
                      background: "var(--c-bg2)",
                      color: link.is_active ? "#10B981" : "var(--c-text3)",
                      cursor: "pointer",
                    }}
                    title={link.is_active ? "Hide" : "Show"}
                  >
                    {link.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openModal(link)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "none",
                      background: "var(--c-bg2)",
                      color: "var(--c-text2)",
                      cursor: "pointer",
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(link.id)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "none",
                      background: "var(--c-bg2)",
                      color: "#EF4444",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1a1a1a",
                margin: "0 0 20px",
              }}
            >
              {editingLink ? "Edit Link" : "Add New Link"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., My Website"
                  style={{
                    ...inputStyle,
                    background: "#f9fafb",
                    border: "1.5px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com"
                  style={{
                    ...inputStyle,
                    background: "#f9fafb",
                    border: "1.5px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Type
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                  }}
                >
                  {LINK_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, type: type.value })
                        }
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: `1.5px solid ${isSelected ? "#f09433" : "#e5e7eb"}`,
                          background: isSelected
                            ? "rgba(240,148,51,0.08)"
                            : "#f9fafb",
                          color: isSelected ? "#f09433" : "#6b7280",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.15s",
                        }}
                      >
                        <Icon size={16} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 11,
                    border: "1.5px solid #e5e7eb",
                    background: "#f9fafb",
                    color: "#6b7280",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 11,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {editingLink ? "Update" : "Add"} Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
