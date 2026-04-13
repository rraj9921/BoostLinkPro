"use client";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SectionIntro from "../SectionIntro";
import { landingContainerStyle, sectionPadding } from "../landingTheme";

const plans = [
  {
    name: "Free Forever",
    price: 0,
    tagline: "Start your Instagram automation journey",
    badge: "FREE FOREVER",
    badgeColor: "#FF4D00",
    cta: "Start Free",
    features: [
      { text: "Link in bio", included: true },
      { text: "Link Unlimited Post", included: true },
      { text: "2 keywords", included: true },
      { text: "Up to 2,000 DMs/month", included: true },
      { text: "No follow prompt", included: false },
      { text: "BoostListpro card", included: false },
      { text: "Early Access New Features", included: false },
    ],
    note: "No credit card required",
  },
  {
    name: "Plus",
    price: 199,
    tagline: "For serious creators and small businesses",
    badge: "MOST POPULAR",
    badgeColor: "#FF4D00",
    featured: true,
    cta: "Upgrade",
    features: [
      { text: "Link in bio", included: true },
      { text: "Link Unlimited Post", included: true },
      { text: "4 keywords", included: true },
      { text: "Up to 1 lakh DMs/month", included: true },
      { text: "Remove BoostListpro branding", included: true },
      { text: "No Follow prompt", included: false },
      { text: "No follow program", included: false },
    ],
  },
  {
    name: "Pro",
    price: 349,
    tagline: "For power users and growing brands",
    cta: "Go Pro",
    features: [
      { text: "Link in bio", included: true },
      { text: "Link Unlimited Post", included: true },
      { text: "10 keywords", included: true },
      { text: "Unlimited DMs", included: true },
      { text: "Ask to follow", included: true },
      { text: "Remove BoostListpro Branding", included: true },
      { text: "Early Access New Features", included: true },
    ],
    note: "Upgrade available across all plans",
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".pc");
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
        .p-section {
          padding: ${sectionPadding}; 
          position: relative; 
          overflow: hidden;
          background: linear-gradient(135deg, #1A0F15 0%, #160A0F 50%, #0F0A0D 100%);
        }
        .p-instagram-faded {
          position: absolute;
          bottom: 60px; right: 80px;
          width: 400px; height: 400px;
          opacity: 0.08;
          pointer-events: none;
          z-index: 1;
        }
        .p-glow-a {
          position: absolute; pointer-events: none;
          top: -100px; left: 10%; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,120,60,.18), transparent 70%);
        }
        .p-glow-b {
          position: absolute; pointer-events: none;
          bottom: -80px; right: 10%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,100,60,.14), transparent 70%);
        }
        .p-glow-c {
          position: absolute; pointer-events: none;
          top: 50%; left: 50%; width: 800px; height: 800px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,77,0,.06), transparent 80%);
        }
        


        .p-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 24px; align-items: stretch; max-width: 1100px; margin: 0 auto;
        }
        
        .pc {
          opacity: 0; transform: translateY(24px);
          transition: opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1),
            border-color .2s, box-shadow .3s, transform .3s;
          display: flex; flex-direction: column;
          border-radius: 24px; padding: 36px 32px 32px;
          background: #fff;
          border: 2px solid rgba(0,0,0,.06);
          position: relative; overflow: visible;
        }
        
        .pc.featured {
          border-color: rgba(255,77,0,.3);
          box-shadow: 0 20px 60px rgba(255,77,0,.2), 0 0 0 1px rgba(255,77,0,.1);
          transform: scale(1.02);
        }
        
        .pc:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,.15);
        }
        .pc.featured:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 28px 70px rgba(255,77,0,.25), 0 0 0 1px rgba(255,77,0,.15);
        }
        
        .pc-badge {
          position: absolute; top: -14px; left: 50%;
          transform: translateX(-50%);
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 99px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700; color: #fff;
          letter-spacing: .08em; text-transform: uppercase;
          white-space: nowrap;
        }
        .pc-badge.free { background: #FF4D00; }
        .pc-badge.popular { background: linear-gradient(135deg, #FF4D00, #FF7A3D); }
        
        .pc-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #0F0A0D; margin-bottom: 8px; text-align: center;
        }
        
        .pc-price-wrap {
          text-align: center; margin-bottom: 12px;
        }
        .pc-price {
          font-family: 'Instrument Serif', serif;
          font-size: 56px; font-weight: 400;
          color: #0F0A0D; line-height: 1;
          display: flex; align-items: baseline; justify-content: center; gap: 4px;
        }
        .pc-currency {
          font-size: 32px; margin-top: 8px;
        }
        .pc-period {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 500;
          color: rgba(0,0,0,.5); margin-left: 4px;
        }
        
        .pc-tagline {
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; line-height: 1.5;
          color: rgba(0,0,0,.6); margin-bottom: 28px;
          min-height: 42px;
        }
        
        .pc-divider {
          height: 1px; background: rgba(0,0,0,.08); margin-bottom: 24px;
        }
        
        .pc-features {
          list-style: none; display: flex; flex-direction: column; gap: 14px;
          flex: 1; margin-bottom: 28px;
        }
        .pc-feature {
          display: flex; align-items: flex-start; gap: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.5; color: rgba(0,0,0,.8);
        }
        .pc-icon {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .pc-icon.check {
          background: rgba(16,185,129,.12);
        }
        .pc-icon.cross {
          background: rgba(244,63,94,.08);
        }
        
        .pc-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; height: 52px; border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          text-decoration: none; transition: all .2s;
          border: none; cursor: pointer;
        }
        .pc-btn.free {
          color: #fff;
          background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          box-shadow: 0 8px 24px rgba(255,77,0,.3);
        }
        .pc-btn.free:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,77,0,.4);
        }
        .pc-btn.plus {
          color: #fff;
          background: linear-gradient(135deg, #FF4D00, #FF7A3D);
          box-shadow: 0 10px 28px rgba(255,77,0,.35);
        }
        .pc-btn.plus:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(255,77,0,.45);
        }
        .pc-btn.pro {
          color: #fff;
          background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          box-shadow: 0 8px 24px rgba(220,39,67,.3);
        }
        .pc-btn.pro:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(220,39,67,.4);
        }
        
        .pc-note {
          text-align: center; margin-top: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: rgba(0,0,0,.45);
        }
        
        @media (max-width: 900px) {
          .p-grid { grid-template-columns: 1fr; max-width: 420px; }
          .pc.featured { transform: scale(1); }
          .pc.featured:hover { transform: translateY(-8px) scale(1) !important; }
        }
      `}</style>

      <section id="pricing" className="p-section">
        <div className="p-glow-a" />
        <div className="p-glow-b" />
        <div className="p-glow-c" />

        {/* Faded Instagram Icon */}
        <div className="p-instagram-faded">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "#FF7A3D" }}
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>

        <div style={landingContainerStyle}>
          <SectionIntro
            eyebrow="Pricing Made Simple"
            title="Choose the perfect plan to grow your Instagram"
            description="Start free and scale fast. Dominate your niche 🚀"
            titleStyle={{ color: "#fff" }}
            descriptionStyle={{ color: "rgba(255,255,255,.7)" }}
          />

          <div ref={ref} className="p-grid">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`pc ${plan.featured ? "featured" : ""}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {plan.badge && (
                  <div
                    className={`pc-badge ${plan.name === "Free Forever" ? "free" : "popular"}`}
                  >
                    {plan.badge}
                  </div>
                )}

                <h3 className="pc-name">{plan.name}</h3>

                <div className="pc-price-wrap">
                  <div className="pc-price">
                    <span className="pc-currency">₹</span>
                    {plan.price}
                    <span className="pc-period">/ month</span>
                  </div>
                </div>

                <p className="pc-tagline">{plan.tagline}</p>

                <div className="pc-divider" />

                <ul className="pc-features">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="pc-feature">
                      <div
                        className={`pc-icon ${feature.included ? "check" : "cross"}`}
                      >
                        {feature.included ? (
                          <Check size={12} color="#10B981" strokeWidth={3} />
                        ) : (
                          <X size={12} color="#F43F5E" strokeWidth={3} />
                        )}
                      </div>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={`pc-btn ${plan.name === "Free Forever" ? "free" : plan.name === "Plus" ? "plus" : "pro"}`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>

                {plan.note && <p className="pc-note">{plan.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
