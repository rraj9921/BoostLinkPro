import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  brandGradient,
  landingContainerStyle,
  sectionPadding,
} from "../landingTheme";

export default function CtaBanner() {
  return (
    <>
      <style>{`
        .cta-section {
          padding: ${sectionPadding}; 
          background: var(--bg2);
          position: relative;
          overflow: hidden;
        }
        .cta-box {
          position: relative; 
          overflow: hidden;
          border-radius: 28px; 
          text-align: center;
          padding: 80px clamp(32px, 6vw, 96px);
          background: linear-gradient(135deg, #1A0F16 0%, #140C11 50%, #0F0A0D 100%);
          border: 1px solid rgba(255,77,0,.15);
          box-shadow: 0 24px 80px rgba(255,77,0,.18), 0 0 0 1px rgba(255,77,0,.08);
        }
        .cta-glow-a {
          position: absolute; pointer-events: none;
          top: -100px; left: -80px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,120,60,.22), transparent 70%);
        }
        .cta-glow-b {
          position: absolute; pointer-events: none;
          bottom: -80px; right: -80px; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(220,39,67,.16), transparent 70%);
        }
        .cta-glow-center {
          position: absolute; pointer-events: none;
          top: 50%; left: 50%; width: 600px; height: 600px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,77,0,.08), transparent 80%);
        }
        .cta-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,.1) 1.5px, transparent 1.5px);
          background-size: 28px 28px; 
          opacity: .12;
        }
        .cta-instagram-faded {
          position: absolute;
          top: 50%; right: 60px;
          transform: translateY(-50%);
          width: 320px; height: 320px;
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }
        .cta-inner { 
          position: relative; 
          z-index: 2;
        }
        .cta-pill {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 9px 18px; border-radius: 99px;
          border: 1px solid rgba(255,122,61,.25);
          background: linear-gradient(135deg, rgba(255,77,0,.12), rgba(220,39,67,.08));
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700; 
          color: #FFB89F;
          margin-bottom: 28px;
          letter-spacing: 0.02em;
        }
        .cta-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 400; 
          line-height: 1.08;
          letter-spacing: -0.02em; 
          color: #fff;
          max-width: 720px; 
          margin: 0 auto 20px;
        }
        .cta-title em {
          font-style: italic;
          background: linear-gradient(90deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-sub {
          font-family: 'DM Sans', sans-serif;
          max-width: 580px; margin: 0 auto 40px;
          font-size: clamp(16px, 1.9vw, 19px);
          line-height: 1.7; 
          color: rgba(255,255,255,.7);
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          height: 56px; padding: 0 32px; border-radius: 14px;
          text-decoration: none; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          box-shadow: 0 16px 48px rgba(255,77,0,.32);
          transition: transform .2s, box-shadow .2s;
        }
        .cta-btn:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 24px 60px rgba(255,77,0,.42); 
        }
        .cta-footnote {
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; 
          color: rgba(255,255,255,.48);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .cta-check {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: rgba(16,185,129,.15);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <section className="cta-section">
        <div style={landingContainerStyle}>
          <div className="cta-box">
            <div className="cta-glow-a" />
            <div className="cta-glow-b" />
            <div className="cta-glow-center" />
            <div className="cta-dots" />

            {/* Faded Instagram Icon */}
            <div className="cta-instagram-faded">
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

            <div className="cta-inner">
              <h2 className="cta-title">
                Ready to stop missing sales from <em>Instagram comments?</em>
              </h2>
              <p className="cta-sub">
                Start automating today. Set up your first keyword trigger in
                under 2 minutes and watch the DMs roll in automatically.
              </p>
              <Link href="/auth/signup" className="cta-btn">
                Get started now <ArrowRight size={17} />
              </Link>
              <p className="cta-footnote">
                <span className="cta-check">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Free forever plan • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
