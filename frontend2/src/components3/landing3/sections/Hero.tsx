"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  Zap,
} from "lucide-react";
import { brandGradient, landingContainerStyle } from "../landingTheme";

const trust = [
  "Free to start",
  "No credit card",
  "Official Meta API",
  "Works worldwide",
];

const FEED = [
  {
    handle: "@sofia.designs",
    comment: "What's the price for your template pack?",
    keyword: "price",
    reply: "Hey Sofia! It's $49. Grab it here → boostlinkpro.com/template",
    ms: "0.4s",
  },
  {
    handle: "@jake.builds",
    comment: "Can you send me the link?",
    keyword: "link",
    reply: "Here you go Jake! → boostlinkpro.com/freeguide",
    ms: "0.3s",
  },
  {
    handle: "@priya.creates",
    comment: "How do I get the free guide?",
    keyword: "free",
    reply: "Sending it now Priya! Check your DMs 🎉",
    ms: "0.5s",
  },
];

const STATS = [
  { value: "2.4M", label: "DMs sent" },
  { value: "98%", label: "Open rate" },
  { value: "< 1s", label: "Response" },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % FEED.length), 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#090508",
        paddingTop: 72,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        /* Backgrounds */
        .h-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
        }
        .h-glow-a {
          position: absolute; pointer-events: none;
          top: -140px; left: -60px; width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(255,55,0,.2) 0%, transparent 65%);
        }
        .h-glow-b {
          position: absolute; pointer-events: none;
          top: 40px; right: -100px; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(255,100,150,.09) 0%, transparent 65%);
        }
        .h-instagram-faded {
          position: absolute;
          bottom: 50%; right: 40px;
          transform: translateY(50%);
          width: 380px; height: 380px;
          opacity: 0.12;
          pointer-events: none;
          z-index: 1;
        }

        /* Floating Notifications */
        .h-float-notif {
          position: absolute; z-index: 4;
          background: rgba(16,12,15,0.96);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          padding: 13px 17px;
          display: flex; align-items: center; gap: 13px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 24px rgba(255,77,0,0.1);
          backdrop-filter: blur(10px);
          max-width: 280px;
        }
        .h-fn-icon {
          width: 38px; height: 38px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .h-fn-text { flex: 1; min-width: 0; }
        .h-fn-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #fff; margin-bottom: 3px;
          word-wrap: break-word;
        }
        .h-fn-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: rgba(255,255,255,.54);
          word-wrap: break-word;
        }
        .h-fn-dot {
          width: 7px; height: 7px;
          border-radius: 50%; flex-shrink: 0;
          animation: hpulse 2s ease-in-out infinite;
        }
        .h-fn-1 { left: 2%; top: 32%; animation: hfn1 5.5s ease-in-out infinite; }
        .h-fn-2 { right: 2%; top: 46%; animation: hfn2 6s ease-in-out infinite; }
        .h-fn-3 { right: 4%; top: 20%; animation: hfn3 6.5s ease-in-out infinite; }
        @keyframes hfn1 { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-16px) rotate(0.5deg); } }
        @keyframes hfn2 { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-14px) rotate(-0.5deg); } }
        @keyframes hfn3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @media (max-width: 1500px) { 
          .h-float-notif { max-width: 240px; padding: 11px 14px; }
          .h-fn-icon { width: 34px; height: 34px; }
          .h-fn-title { font-size: 12px; }
          .h-fn-sub { font-size: 10px; }
        }
        @media (max-width: 1300px) { .h-float-notif { display: none !important; } }

        /* Layout */
        .h-layout {
          position: relative; z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 56px 0 32px;
          max-width: 1140px;
          margin: 0 auto;
        }

        /* Copy */
        .h-topline {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; margin-bottom: 28px;
          justify-content: center;
        }
        .h-eyebrow {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 7px 16px; border-radius: 99px;
          border: 1px solid rgba(220,39,67,.35);
          background: linear-gradient(135deg, rgba(240,148,51,.15), rgba(188,24,136,.15));
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: .06em;
          background-clip: padding-box;
          color: #FF9166;
          margin-bottom: 0;
        }
        .h-meta-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 7px 14px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.05);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,.74);
        }
        .h-meta-mark {
          width: 16px; height: 16px; display: inline-flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .h-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(54px, 7vw, 96px);
          line-height: 1.02; letter-spacing: -.028em;
          color: #fff; font-weight: 400;
          margin: 0 0 32px;
        }
        .h-title em {
          font-style: italic;
          background: linear-gradient(90deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .h-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 20px; line-height: 1.82;
          color: rgba(255,255,255,.68);
          max-width: 680px; margin: 0 auto 40px;
        }
        .h-actions {
          display: flex; gap: 12px; align-items: center;
          flex-wrap: wrap; margin-bottom: 36px;
          justify-content: center;
        }
        .h-btn-p {
          display: inline-flex; align-items: center; gap: 9px;
          height: 54px; padding: 0 32px; border-radius: 13px;
          background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #fff; text-decoration: none;
          box-shadow: 0 12px 36px rgba(220,39,67,.4);
          transition: transform .16s, box-shadow .16s;
        }
        .h-btn-p:hover { transform: translateY(-2px); box-shadow: 0 18px 48px rgba(220,39,67,.5); }
        .h-btn-s {
          display: inline-flex; align-items: center; gap: 7px;
          height: 54px; padding: 0 28px; border-radius: 13px;
          border: 1px solid rgba(255,255,255,.15);
          background: rgba(255,255,255,.05);
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px; font-weight: 600;
          color: rgba(255,255,255,.74); text-decoration: none;
          transition: border-color .16s, background .16s, color .16s;
        }
        .h-btn-s:hover { border-color: rgba(255,255,255,.24); background: rgba(255,255,255,.08); color: #fff; }
        .h-trust { display: flex; flex-wrap: wrap; gap: 8px 22px; justify-content: center; margin-bottom: 52px; }
        .h-trust-item {
          display: flex; align-items: center; gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,.48);
        }
        .h-check {
          width: 17px; height: 17px; border-radius: 50%; flex-shrink: 0;
          background: rgba(16,185,129,.12);
          border: 1px solid rgba(16,185,129,.28);
          display: flex; align-items: center; justify-content: center;
        }

        /* Panel */
        .h-panel {
          background: #100C0F;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,.12);
          overflow: hidden;
          position: relative;
          max-width: 980px;
          width: 100%;
          margin: 0 auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
        }
        .h-panel::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(circle at 85% 5%, rgba(220,39,67,.14), transparent 40%);
        }
        .h-topbar {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .h-dots span {
          width: 9px; height: 9px; border-radius: 50%;
          display: inline-block; margin-right: 5px;
        }
        .h-url {
          flex: 1; background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 6px; padding: 5px 10px;
          font-family: 'DM Sans', monospace;
          font-size: 10px; color: rgba(255,255,255,.36);
          text-align: center;
        }
        .h-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .h-stat {
          padding: 14px 16px; text-align: center;
          border-right: 1px solid rgba(255,255,255,.07);
        }
        .h-stat:last-child { border-right: none; }
        .h-stat-v {
          display: block;
          font-family: 'Instrument Serif', serif;
          font-size: 22px; color: #fff; line-height: 1; margin-bottom: 4px;
        }
        .h-stat-l {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: rgba(255,255,255,.36);
        }
        .h-rule {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          flex-wrap: wrap;
        }
        .h-rule-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .06em;
          color: rgba(255,255,255,.36);
        }
        .h-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 99px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 700;
        }
        .hc-kw { background: rgba(255,77,0,.13); border: 1px solid rgba(255,77,0,.24); color: #FF9166; }
        .hc-act { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2); color: #34D399; }
        .hc-live { background: rgba(99,102,241,.11); border: 1px solid rgba(99,102,241,.22); color: #A5B4FC; }
        .h-arrow { color: rgba(255,255,255,.2); font-size: 11px; }
        .h-live {
          margin-left: auto; display: flex; align-items: center; gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700; color: #34D399;
        }
        .h-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10B981;
          animation: hpulse 2s ease-in-out infinite;
        }
        @keyframes hpulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.4); }
          50% { box-shadow: 0 0 0 4px rgba(16,185,129,.08); }
        }
        .h-feed {
          padding: 14px 14px 14px;
          display: flex; flex-direction: column; gap: 10px;
          min-height: 170px;
        }
        .h-handle {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 700;
          color: rgba(255,255,255,.32);
          margin-bottom: 4px; padding-left: 2px;
        }
        .h-bubble-in {
          display: inline-block; max-width: 84%;
          padding: 8px 11px;
          border-radius: 13px 13px 13px 3px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.07);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; line-height: 1.5;
          color: rgba(255,255,255,.78);
        }
        .h-kw { color: #FF8040; font-weight: 700; }
        .h-out-wrap { display: flex; flex-direction: column; align-items: flex-end; }
        .h-bubble-out {
          display: inline-block; max-width: 88%;
          padding: 8px 11px; position: relative;
          border-radius: 13px 13px 3px 13px;
          background: linear-gradient(135deg, #FF4D00, #FF7A3D);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; line-height: 1.5; color: #fff;
          box-shadow: 0 6px 20px rgba(255,77,0,.24);
        }
        .h-auto-tag {
          position: absolute; top: -8px; right: 8px;
          background: rgba(255,255,255,.2); border-radius: 99px;
          padding: 2px 7px; font-size: 8.5px; font-weight: 700;
          color: #fff; display: flex; align-items: center; gap: 3px;
        }
        .h-sent {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; color: rgba(255,255,255,.24);
          margin-top: 3px; padding-right: 2px;
        }
        .h-dots-nav { display: flex; gap: 5px; justify-content: center; padding: 0 0 4px; }
        .h-dot-nav {
          height: 5px; border-radius: 99px;
          cursor: pointer;
          transition: width .3s, background .3s;
        }
        @keyframes hfeedIn {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .h-fi { animation: hfeedIn .38s cubic-bezier(.16,1,.3,1) both; }
        .h-fi-d { animation: hfeedIn .38s .16s cubic-bezier(.16,1,.3,1) both; }

        /* Curve */
        .h-curve { position: relative; z-index: 3; margin-top: -1px; }

        /* Responsive */
        @media (max-width: 520px) {
          .h-btn-p, .h-btn-s { width: 100%; justify-content: center; }
          .h-actions { flex-direction: column; }
          .h-title { font-size: clamp(40px, 10vw, 54px); }
        }
      `}</style>

      <div className="h-grid" />
      <div className="h-glow-a" />
      <div className="h-glow-b" />

      {/* Faded Instagram Icon */}
      <div className="h-instagram-faded">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "#dc2743" }}
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>

      {/* Floating Notifications */}
      <div className="h-float-notif h-fn-1">
        <div className="h-fn-icon" style={{ background: "rgba(255,77,0,.13)" }}>
          <MessageCircle size={19} color="#FF6B35" />
        </div>
        <div className="h-fn-text">
          <div className="h-fn-title">Keyword triggered</div>
          <div className="h-fn-sub">Comment matched → DM sent</div>
        </div>
        <div className="h-fn-dot" style={{ background: "#10B981" }} />
      </div>

      <div className="h-float-notif h-fn-2">
        <div
          className="h-fn-icon"
          style={{ background: "rgba(16,185,129,.13)" }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className="h-fn-text">
          <div className="h-fn-title">Payment received</div>
          <div className="h-fn-sub">Product delivered</div>
        </div>
        <div className="h-fn-dot" style={{ background: "#10B981" }} />
      </div>

      <div className="h-float-notif h-fn-3">
        <div
          className="h-fn-icon"
          style={{ background: "rgba(99,102,241,.13)" }}
        >
          <Zap size={19} color="#6366F1" />
        </div>
        <div className="h-fn-text">
          <div className="h-fn-title">Automation active</div>
          <div className="h-fn-sub">Running 24/7</div>
        </div>
      </div>

      <div style={landingContainerStyle}>
        <div className="h-layout">
          {/* Copy */}
          <div>
            <div className="h-topline">
              <div className="h-eyebrow">
                <img
                  src="/instagram.png"
                  alt="Instagram"
                  width="32"
                  height="32"
                  style={{ display: "block" }}
                />
                Instagram DM automation
              </div>
              <div className="h-meta-badge">
                  <img
                    src="/meta.png"
                    alt="Meta"
                    width="24"
                    height="24"
                    style={{ display: "block" }}
                  />
                Meta-approved APIs
              </div>
            </div>
            <h1 className="h-title">
              Turn <em>Instagram</em> comments into instant DMs and real sales
            </h1>
            <p className="h-sub">
              Someone drops a keyword on your post — they instantly get your
              personalised offer in DMs. Set it once, sell while you sleep.
            </p>
            <div className="h-actions">
              <Link href="/auth/signup" className="h-btn-p">
                Start for free <ArrowRight size={15} />
              </Link>
              <a href="#how" className="h-btn-s">
                See how it works <ChevronRight size={14} />
              </a>
            </div>
            <div className="h-trust">
              {trust.map((t) => (
                <div key={t} className="h-trust-item">
                  <div className="h-check">
                    <Check size={9} color="#10B981" strokeWidth={2.5} />
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="h-panel">
            <div className="h-topbar">
              <div className="h-dots">
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </div>
              <div className="h-url">app.boostlinkpro.com</div>
            </div>

            <div className="h-stats">
              {STATS.map((s) => (
                <div key={s.label} className="h-stat">
                  <span className="h-stat-v">{s.value}</span>
                  <span className="h-stat-l">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="h-rule">
              <span className="h-rule-label">Rule</span>
              <span className="h-chip hc-kw">
                <MessageCircle size={9} /> keyword
              </span>
              <span className="h-arrow">→</span>
              <span className="h-chip hc-act">
                <Zap size={9} /> send DM
              </span>
              <span className="h-arrow">→</span>
              <span className="h-chip hc-live">live</span>
              <div className="h-live">
                <div className="h-live-dot" /> Active
              </div>
            </div>

            <div className="h-feed">
              {FEED.map(
                (item, i) =>
                  i === active && (
                    <div key={i}>
                      <div className="h-fi" style={{ marginBottom: 8 }}>
                        <div className="h-handle">{item.handle}</div>
                        <div className="h-bubble-in">
                          {item.comment
                            .split(item.keyword)
                            .map((part, j, arr) => (
                              <span key={j}>
                                {part}
                                {j < arr.length - 1 && (
                                  <span className="h-kw">{item.keyword}</span>
                                )}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="h-fi-d h-out-wrap">
                        <div className="h-bubble-out">
                          <div className="h-auto-tag">
                            <Zap size={7} fill="white" color="white" /> Auto
                          </div>
                          {item.reply}
                        </div>
                        <div className="h-sent">Delivered in {item.ms}</div>
                      </div>
                    </div>
                  ),
              )}
              <div className="h-dots-nav">
                {FEED.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-dot-nav"
                    style={{
                      width: i === active ? 18 : 5,
                      background:
                        i === active ? "#FF5020" : "rgba(255,255,255,.14)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-curve">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 56 }}
        >
          <path
            d="M0 28C360 56 720 56 1080 32C1260 20 1370 8 1440 0V56H0V28Z"
            fill="var(--bg)"
          />
        </svg>
      </div>
    </section>
  );
}
