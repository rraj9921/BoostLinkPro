"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Instagram, Settings2, TrendingUp } from "lucide-react";
import SectionIntro from "../SectionIntro";
import { landingContainerStyle, sectionPadding } from "../landingTheme";

const steps = [
  {
    n: "01", icon: Instagram, color: "#FF4D00", tint: "rgba(255,77,0,.1)",
    title: "Connect your Instagram",
    desc: "Link your Business or Creator account in minutes. Log in, grant permissions, done. Takes under 2 minutes.",
    detail: "OAuth 2.0 · Secure · No credentials stored",
  },
  {
    n: "02", icon: Settings2, color: "#8B5CF6", tint: "rgba(139,92,246,.1)",
    title: "Set a keyword trigger",
    desc: "Choose any word. Write the DM you want sent. Toggle the automation on. No code, no technical setup whatsoever.",
    detail: "Unlimited keywords · Any post or all posts",
  },
  {
    n: "03", icon: TrendingUp, color: "#10B981", tint: "rgba(16,185,129,.1)",
    title: "Earn on autopilot",
    desc: "Every matching comment fires your personalised message instantly — while you're creating, travelling, or asleep.",
    detail: "Runs 24/7 · Handles any volume",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".hiw-card");
    if (!els) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .hiw-section {
          padding: ${sectionPadding}; background: var(--bg);
          position: relative; overflow: hidden;
        }
        .hiw-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(var(--border2, rgba(255,255,255,.04)) 1px, transparent 1px);
          background-size: 30px 30px; opacity: .4;
        }
        .hiw-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px; margin-bottom: 20px;
        }
        .hiw-card {
          opacity: 0; transform: translateY(22px);
          transition: opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1),
            border-color .18s, box-shadow .18s;
          padding: 28px 24px; border-radius: 18px;
          border: 1px solid var(--border); background: var(--card);
          position: relative;
        }
        .hiw-card:hover { transform: translateY(-4px) !important; border-color: rgba(255,77,0,.2); box-shadow: 0 18px 50px rgba(255,77,0,.07); }
        .hiw-num {
          position: absolute; top: 18px; right: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 36px; font-weight: 700; line-height: 1;
          color: rgba(255,77,0,.06);
        }
        .hiw-icon {
          width: 52px; height: 52px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .hiw-step-badge {
          display: inline-block; margin-bottom: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700;
          padding: 3px 9px; border-radius: 99px; letter-spacing: .05em;
        }
        .hiw-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--text1); line-height: 1.25; margin-bottom: 10px;
        }
        .hiw-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; line-height: 1.78; color: var(--text3);
          margin-bottom: 14px;
        }
        .hiw-detail {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          color: var(--text4); padding: 4px 10px;
          border-radius: 99px; background: var(--bg2);
        }

        /* Demo box */
        .hiw-demo {
          border-radius: 18px;
          border: 1px solid var(--border); background: var(--card);
          padding: 28px 32px; position: relative; overflow: hidden;
        }
        .hiw-demo::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #FF4D00, #FF8C42, #FFB347);
        }
        .hiw-demo-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: #FF4D00; text-align: center; margin-bottom: 24px;
        }
        .hiw-demo-grid {
          display: grid; grid-template-columns: 1fr 48px 1fr; gap: 16px; align-items: center;
        }
        .hiw-demo-box {
          padding: 18px 20px; border-radius: 14px;
          border: 1px solid var(--border); background: var(--bg2);
        }
        .hiw-demo-box.out {
          border-color: rgba(255,77,0,.2); background: rgba(255,77,0,.04);
        }
        .hiw-demo-box-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: var(--text4); margin-bottom: 8px;
        }
        .hiw-demo-box-label.out { color: #C94D0B; }
        .hiw-demo-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--text2); line-height: 1.7;
        }
        .hiw-arrow-center {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .hiw-arrow-icon {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,77,0,.09); border: 1px solid rgba(255,77,0,.18);
        }
        .hiw-instant {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 800;
          color: #FF4D00; letter-spacing: .1em; text-transform: uppercase;
        }

        @media (max-width: 860px) {
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-demo-grid { grid-template-columns: 1fr; gap: 12px; }
          .hiw-arrow-center { display: none; }
          .hiw-demo { padding: 24px 20px; }
        }
      `}</style>

      <section id="how" className="hiw-section">
        <div className="hiw-bg" />
        <div style={landingContainerStyle}>
          <SectionIntro
            eyebrow="How it works"
            title="Live in under 10 minutes"
            description="No code. No technical setup. Connect your Instagram, pick your keywords, and your automation runs forever."
          />

          <div ref={ref} className="hiw-grid">
            {steps.map(({ n, icon: Icon, color, tint, title, desc, detail }, i) => (
              <div key={n} className="hiw-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="hiw-num">{n}</span>
                <div className="hiw-icon" style={{ background: tint }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="hiw-step-badge"
                  style={{ background: `${color}14`, color }}>
                  Step {n}
                </div>
                <h3 className="hiw-title">{title}</h3>
                <p className="hiw-desc">{desc}</p>
                <span className="hiw-detail">{detail}</span>
              </div>
            ))}
          </div>

          <div className="hiw-demo">
            <p className="hiw-demo-label">Real example — what happens in 0.3 seconds</p>
            <div className="hiw-demo-grid">
              <div className="hiw-demo-box">
                <p className="hiw-demo-box-label">Fan comments on your post</p>
                <p className="hiw-demo-text">
                  "This is exactly what I needed! What's the{" "}
                  <strong style={{ color: "#FF4D00" }}>price</strong>?"
                </p>
              </div>
              <div className="hiw-arrow-center">
                <div className="hiw-arrow-icon">
                  <ArrowRight size={18} color="#FF4D00" />
                </div>
                <p className="hiw-instant">Instant</p>
              </div>
              <div className="hiw-demo-box out">
                <p className="hiw-demo-box-label out">They receive in DMs ⚡</p>
                <p className="hiw-demo-text">
                  "Hey! My guide is $49 — grab it here 👉{" "}
                  <span style={{ color: "#FF4D00", fontWeight: 600 }}>
                    link.boostlinkpro.com/guide
                  </span>"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
