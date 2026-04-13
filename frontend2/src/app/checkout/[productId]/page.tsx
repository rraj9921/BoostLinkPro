"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingBag,
  Download,
  Check,
  Loader2,
  AlertCircle,
  Lock,
  FileText,
  Video,
  Music,
  BookOpen,
  Layout,
  Package,
} from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: string;
  file_url?: string;
  is_active: boolean;
  user_id: string;
};

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  pdf: { label: "PDF", icon: <FileText size={24} />, color: "#EF4444" },
  video: { label: "Video", icon: <Video size={24} />, color: "#8B5CF6" },
  audio: { label: "Audio", icon: <Music size={24} />, color: "#0EA5E9" },
  course: { label: "Course", icon: <BookOpen size={24} />, color: "#F59E0B" },
  template: {
    label: "Template",
    icon: <Layout size={24} />,
    color: "#10B981",
  },
  other: {
    label: "Digital Product",
    icon: <Package size={24} />,
    color: "#6B7280",
  },
};

function fmtPrice(cents: number): string {
  return `₹${(cents / 100).toFixed(2)}`;
}

export default function CheckoutPage() {
  const params = useParams();
  const productId = params?.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/products/public/${productId}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Product not found");
          setLoading(false);
          return;
        }

        setProduct(data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProcessing(true);

    try {
      // This would integrate with payment gateway (Razorpay/Stripe)
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment successful! Check your email for download link.");
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const cfg = product
    ? (TYPE_CONFIG[product.type] ?? TYPE_CONFIG.other)
    : TYPE_CONFIG.other;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 20,
        }}
      >
        <Loader2
          size={32}
          color="white"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p style={{ color: "white", marginTop: 12, fontSize: 14 }}>
          Loading product...
        </p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <AlertCircle size={32} color="white" />
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "white",
            margin: "0 0 8px",
          }}
        >
          Product Not Found
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
          {error || "This product doesn't exist or is no longer available."}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
        padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Product Info */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `${cfg.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
          </div>

          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: cfg.color,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 8px",
            }}
          >
            {cfg.label}
          </p>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1a1a1a",
              margin: "0 0 12px",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "#666",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            {product.description || "Digital product for instant download"}
          </p>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#666",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              Price
            </p>
            <p
              style={{
                fontSize: 36,
                fontWeight: 800,
                background: "linear-gradient(135deg, #f09433, #dc2743)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {fmtPrice(product.price_cents)}
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Check size={18} color="#10B981" />
              <span style={{ fontSize: 14, color: "#333" }}>
                Instant delivery via email
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Check size={18} color="#10B981" />
              <span style={{ fontSize: 14, color: "#333" }}>
                Lifetime access
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Check size={18} color="#10B981" />
              <span style={{ fontSize: 14, color: "#333" }}>
                Secure payment
              </span>
            </div>
            {product.file_url && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Download size={18} color="#10B981" />
                <span style={{ fontSize: 14, color: "#333" }}>
                  Downloadable file included
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <Lock size={20} color="#10B981" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>
              Secure Checkout
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#333",
                  marginBottom: 8,
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color .2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#dc2743")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                placeholder="John Doe"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#333",
                  marginBottom: 8,
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color .2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#dc2743")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                placeholder="john@example.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#333",
                  marginBottom: 8,
                }}
              >
                Phone Number
                <span style={{ color: "#999", fontWeight: 400 }}>
                  {" "}
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color .2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#dc2743")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                placeholder="+91 98765 43210"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              style={{
                width: "100%",
                padding: "16px",
                background: processing
                  ? "#ccc"
                  : "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: processing ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: processing
                  ? "none"
                  : "0 8px 24px rgba(220,39,67,0.3)",
                transition: "all .2s",
              }}
            >
              {processing ? (
                <>
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Complete Purchase — {fmtPrice(product.price_cents)}
                </>
              )}
            </button>

            <p
              style={{
                fontSize: 11,
                color: "#999",
                textAlign: "center",
                margin: "16px 0 0",
                lineHeight: 1.5,
              }}
            >
              By completing this purchase, you agree to our terms of service.
              Your payment is secure and encrypted.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
