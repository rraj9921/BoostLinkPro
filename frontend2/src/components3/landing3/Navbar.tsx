"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Zap, X } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";
import { brandGradient } from "./landingTheme";

const navLinks = [
  ["Features", "#features"],
  ["How it works", "#how"],
  ["Pricing", "#pricing"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        .nav-wrap {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all .3s ease;
          padding: 12px 0;
        }
        .nav-wrap.scrolled {
          background: #0a0709;
          border-bottom: 2px solid #FF4D00;
          box-shadow: 0 8px 32px rgba(255,77,0,.2), 0 2px 8px rgba(0,0,0,.6);
          padding: 8px 0;
        }
        .nav-wrap:not(.scrolled) {
          background: #0a0709;
          border-bottom: 2px solid rgba(255,77,0,.4);
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
        }
        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 32px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .nav-brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: ${brandGradient};
          box-shadow: 0 6px 20px rgba(255,77,0,.3);
          flex-shrink: 0;
        }
        .nav-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 19px; font-weight: 700;
          letter-spacing: -0.04em; color: #fff;
          white-space: nowrap;
        }
        .nav-brand-name span { color: #FF7A3D; }
        .nav-links {
          display: flex; align-items: center; gap: 28px; flex: 1; justify-content: center;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: rgba(255,255,255,.72); text-decoration: none;
          transition: color .15s;
          position: relative; padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -2px;
          height: 1.5px; border-radius: 99px;
          background: #FF6030; opacity: 0;
          transform: scaleX(.5); transition: opacity .15s, transform .15s;
        }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { opacity: 1; transform: scaleX(1); }
        .nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .nav-login {
          display: inline-flex; align-items: center;
          height: 40px; padding: 0 15px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.05);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: rgba(255,255,255,.8); text-decoration: none;
          transition: border-color .15s, color .15s, background .15s;
        }
        .nav-login:hover {
          border-color: rgba(255,255,255,.22);
          color: #fff; background: rgba(255,255,255,.08);
        }
        .nav-cta {
          display: inline-flex; align-items: center;
          height: 40px; padding: 0 18px; border-radius: 11px;
          background: ${brandGradient};
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #fff; text-decoration: none;
          box-shadow: 0 6px 20px rgba(255,77,0,.28);
          transition: transform .15s, box-shadow .15s;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(255,77,0,.36); }
        .nav-mobile-btn {
          display: none; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.05);
          color: #fff; cursor: pointer;
          transition: background .15s;
        }
        .nav-mobile-btn:hover { background: rgba(255,255,255,.09); }
        .nav-mobile-menu {
          border-top: 1px solid rgba(255,255,255,.08);
          background: rgba(10,7,9,.96);
          padding: 16px 32px 24px;
        }
        .nav-mobile-link {
          display: block; padding: 12px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: rgba(255,255,255,.8); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,.06);
          transition: color .15s;
        }
        .nav-mobile-link:hover { color: #fff; }
        .nav-mobile-actions { display: flex; gap: 8px; margin-top: 16px; }
        @media (max-width: 860px) {
          .nav-links, .nav-actions { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .nav-inner { padding: 0 20px; }
          .nav-mobile-menu { padding: 16px 20px 24px; }
        }
      `}</style>

      <nav className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <div className="nav-brand-icon">
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <span className="nav-brand-name">
              Boostlink<span>Pro</span>
            </span>
          </Link>

          <div className="nav-links">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/auth/login" className="nav-login">
              Sign in
            </Link>
            <Link href="/auth/signup" className="nav-cta">
              Get early access
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button
              className="nav-mobile-btn"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="nav-mobile-menu">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="nav-mobile-link"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="nav-mobile-actions">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="nav-login"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                className="nav-cta"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Get access
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
