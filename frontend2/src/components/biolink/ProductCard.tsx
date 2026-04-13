import { ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: string;
  thumbnail_url?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = (product.price_cents / 100).toFixed(2);

  return (
    <a
      href={`/checkout/${product.id}`}
      style={{
        display: "block",
        borderRadius: 16,
        background: "white",
        border: "1.5px solid #e5e7eb",
        overflow: "hidden",
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(240,148,51,0.2)";
        e.currentTarget.style.borderColor = "#f09433";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          aspectRatio: "16/9",
          background: product.thumbnail_url
            ? `url(${product.thumbnail_url})`
            : "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!product.thumbnail_url && (
          <ShoppingBag size={40} color="white" style={{ opacity: 0.7 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            margin: "0 0 12px",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{price}
          </span>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background:
                "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </a>
  );
}
