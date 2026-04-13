import { Instagram, ExternalLink } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  instagram?: {
    username: string;
    profile_picture_url?: string;
    followers_count?: number;
  } | null;
}

export default function ProfileHeader({
  username,
  full_name,
  bio,
  avatar_url,
  instagram,
}: ProfileHeaderProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
        borderRadius: "0 0 24px 24px",
        marginBottom: 32,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "white",
          border: "4px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 36,
          fontWeight: 800,
          color: "#f09433",
          backgroundImage: avatar_url ? `url(${avatar_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {!avatar_url && full_name[0]?.toUpperCase()}
      </div>

      {/* Name */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "white",
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
        }}
      >
        {full_name}
      </h1>

      {/* Username */}
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.85)",
          margin: "0 0 16px",
          fontWeight: 500,
        }}
      >
        @{username}
      </p>

      {/* Bio */}
      {bio && (
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.95)",
            margin: "0 0 16px",
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          {bio}
        </p>
      )}

      {/* Instagram Link */}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.username}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            border: "1.5px solid rgba(255,255,255,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Instagram size={16} />
          <span>@{instagram.username}</span>
          {instagram.followers_count && (
            <span style={{ opacity: 0.8 }}>
              • {(instagram.followers_count / 1000).toFixed(1)}K
            </span>
          )}
          <ExternalLink size={14} style={{ opacity: 0.7 }} />
        </a>
      )}
    </div>
  );
}
