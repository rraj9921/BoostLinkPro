"use client";
import { useEffect, useRef } from "react";
import {
  BarChart2,
  Link2,
  MessageCircle,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import SectionIntro from "../SectionIntro";
import { landingContainerStyle, sectionPadding } from "../landingTheme";

const features = [
  {
    icon: MessageCircle,
    color: "#FF4D00",
    tint: "rgba(255,77,0,.1)",
    title: "Comment-to-DM automation",
    description:
      "Set a keyword on any post or reel. Every time someone comments it, they instantly receive your personalised DM — automatically, with no manual work ever.",
    tag: "Core feature",
  },
  {
    icon: ShoppingBag,
    color: "#10B981",
    tint: "rgba(16,185,129,.1)",
    title: "Sell digital products",
    description:
      "Upload your PDF, course, or template. Buyers pay via Stripe and receive their download link automatically — zero manual delivery.",
    tag: "Most popular",
  },
  {
    icon: Link2,
    color: "#0EA5E9",
    tint: "rgba(14,165,233,.1)",
    title: "Link-in-bio store",
    description:
      "Your own page at boostlinkpro.com/yourname — all your products, links, and offers in one URL perfect for your Instagram bio.",
  },
  {
    icon: Zap,
    color: "#8B5CF6",
    tint: "rgba(139,92,246,.1)",
    title: "Auto-reply to comments",
    description:
      "Post a public reply on every matched comment before the DM goes out — more engagement signals, zero manual effort.",
  },
  {
    icon: Users,
    color: "#F43F5E",
    tint: "rgba(244,63,94,.1)",
    title: "Followers-only mode",
    description:
      "Optionally restrict automations to followers only — ideal for exclusive drops and early-access launches.",
  },
  {
    icon: BarChart2,
    color: "#F59E0B",
    tint: "rgba(245,158,11,.1)",
    title: "Analytics dashboard",
    description:
      "See which keywords drive the most DMs, which products convert, and how your bio link performs — all in one place.",
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".feat-card");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.08 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .feat-section {
          padding: ${sectionPadding}; background: var(--bg2);
          position: relative; overflow: hidden;
        }
        .feat-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,77,0,.08) 1px, transparent 1px);
          background-size: 36px 36px; opacity: .18;
        }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        .feat-card {
          opacity: 0; transform: translateY(22px);
          transition: opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1),
            border-color .2s, box-shadow .3s;
          padding: 32px 28px; border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--card);
          position: relative; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .feat-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #f09433, #dc2743, #bc1888);
          opacity: 0; transition: opacity .3s;
        }
        .feat-card::after {
          content: ''; position: absolute;
          inset: 0; opacity: 0;
          background: linear-gradient(135deg, rgba(255,77,0,.05), transparent 60%);
          transition: opacity .3s;
        }
        .feat-card:hover { 
          border-color: rgba(255,77,0,.25); 
          box-shadow: 0 12px 40px rgba(255,77,0,.12), 0 0 0 1px rgba(255,77,0,.08);
        }
        .feat-card:hover { transform: translateY(-6px) !important; }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:hover::after { opacity: 1; }
        .feat-tag {
          display: inline-block; margin-bottom: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          padding: 5px 11px; border-radius: 99px;
          background: rgba(16,185,129,.1); color: #10B981;
          letter-spacing: .06em; text-transform: uppercase;
        }
        .feat-tag.core { background: rgba(255,77,0,.1); color: #FF7A3D; }
        .feat-icon {
          width: 54px; height: 54px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform .2s;
        }
        .feat-card:hover .feat-icon { transform: scale(1.08); }
        .feat-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 19px; font-weight: 700;
          color: var(--text1); margin-bottom: 12px; line-height: 1.3;
        }
        .feat-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px; line-height: 1.75; color: var(--text3);
        }
        @media (max-width: 960px) { .feat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 560px) { .feat-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section id="features" className="feat-section">
        <div className="feat-bg" />
        <div style={landingContainerStyle}>
          <SectionIntro
            eyebrow="Features"
            title="Everything you need to grow and monetise on Instagram"
            description="Stop manually replying to the same questions. Start earning from content you've already created — while you sleep."
          />
          <div ref={ref} className="feat-grid">
            {features.map(
              ({ icon: Icon, color, tint, title, description, tag }, i) => (
                <div
                  key={title}
                  className="feat-card"
                  style={{ transitionDelay: `${i * 0.055}s` }}
                >
                  {tag && (
                    <div
                      className={`feat-tag${tag === "Core feature" ? " core" : ""}`}
                    >
                      {tag}
                    </div>
                  )}
                  <div className="feat-icon" style={{ background: tint }}>
                    <Icon size={24} color={color} strokeWidth={2} />
                  </div>
                  <h3 className="feat-title">{title}</h3>
                  <p className="feat-desc">{description}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
