import { Metadata } from "next";
import ProfileHeader from "@/components/biolink/ProfileHeader";
import LinkCard from "@/components/biolink/LinkCard";
import ProductCard from "@/components/biolink/ProductCard";
import type { BioLink } from "@/types";

interface PageProps {
  params: { username: string };
}

interface ProfileData {
  profile: {
    username: string;
    full_name: string;
    bio?: string;
    avatar_url?: string;
  };
  instagram?: {
    username: string;
    profile_picture_url?: string;
    followers_count?: number;
  } | null;
  bioLinks: BioLink[];
  products: Array<{
    id: string;
    name: string;
    description: string;
    price_cents: number;
    type: string;
    thumbnail_url?: string;
  }>;
}

async function getProfile(username: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${username}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const profile = await getProfile(params.username);
  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }
  return {
    title: `${profile.profile.full_name} (@${profile.profile.username}) | BoostLinkPro`,
    description:
      profile.profile.bio ||
      `Check out ${profile.profile.full_name}'s links and products`,
  };
}

export default async function BioLinkPage({ params }: PageProps) {
  const data = await getProfile(params.username);

  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#1a1a1a",
              margin: "0 0 8px",
            }}
          >
            Profile Not Found
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", margin: "0 0 24px" }}>
            This username doesn&apos;t exist or the profile is inactive
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <ProfileHeader
          username={data.profile.username}
          full_name={data.profile.full_name}
          bio={data.profile.bio}
          avatar_url={data.profile.avatar_url}
          instagram={data.instagram}
        />

        <div style={{ padding: "0 20px 40px" }}>
          {/* Bio Links */}
          {data.bioLinks.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {data.bioLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {data.products.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1a1a1a",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Digital Products
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.bioLinks.length === 0 && data.products.length === 0 && (
            <div style={{ textAlign: "center", padding: 60 }}>
              <p style={{ fontSize: 16, color: "#9ca3af" }}>
                No links or products yet. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "32px 20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#6b7280",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 800,
              }}
            >
              Create your own BoostLinkPro
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
