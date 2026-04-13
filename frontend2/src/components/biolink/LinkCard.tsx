import {
  Globe,
  Instagram,
  ShoppingBag,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";
import type { BioLink } from "@/types";

interface LinkCardProps {
  link: BioLink;
}

const ICONS = {
  link: Globe,
  social: Instagram,
  product: ShoppingBag,
  amazon: ExternalLinkIcon,
  myntra: ExternalLinkIcon,
};

export default function LinkCard({ link }: LinkCardProps) {
  const Icon = ICONS[link.type] || Globe;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        padding: "18px 24px",
        borderRadius: 16,
        background: "white",
        border: "1.5px solid #e5e7eb",
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(240,148,51,0.15)";
        e.currentTarget.style.borderColor = "#f09433";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {link.title}
          </h3>
        </div>
        <ExternalLinkIcon
          size={18}
          style={{ color: "#9ca3af", flexShrink: 0 }}
        />
      </div>
    </a>
  );
}
