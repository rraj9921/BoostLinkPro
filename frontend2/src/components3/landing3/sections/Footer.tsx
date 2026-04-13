import Link from "next/link";
import { Zap } from "lucide-react";
import { brandGradient, landingContainerStyle } from "../landingTheme";

const columns = [
  {
    title: "Product",
    links: [
      ["Features", "#features"],
      ["How it works", "#how"],
      ["Pricing", "#pricing"],
      ["Dashboard", "/dashboard"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Contact", "mailto:hello@boostlinkpro.com"],
      ["Support", "/faqs"],
      ["Roadmap", "#"],
      ["Early access", "/auth/signup"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
      ["Data Deletion", "/data-deletion"],
    ],
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-root {
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 80px 0 40px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 56px;
          margin-bottom: 56px;
        }
        .footer-brand-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: ${brandGradient};
          box-shadow: 0 8px 24px rgba(255,77,0,.28);
          margin-bottom: 18px;
        }
        .footer-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 21px; font-weight: 700;
          letter-spacing: -0.03em; color: var(--text1);
          margin-bottom: 14px;
        }
        .footer-brand-name span { color: #FF4D00; }
        .footer-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px; line-height: 1.7;
          color: var(--text3); max-width: 340px;
          margin-bottom: 24px;
        }
        .footer-col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--text1); margin-bottom: 20px;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-link {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; 
          color: var(--text3);
          text-decoration: none; 
          transition: color .2s, transform .2s;
          line-height: 1.5;
        }
        .footer-link:hover { 
          color: #FF4D00;
          transform: translateX(3px);
        }
        .footer-bottom {
          padding-top: 28px; border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .footer-bottom-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text4);
        }
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
          .footer-brand { grid-column: 1 / -1; max-width: 100%; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; gap: 36px; }
          .footer-bottom { flex-direction: column; text-align: center; gap: 8px; }
        }
      `}</style>

      <footer className="footer-root">
        <div style={landingContainerStyle}>
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <Zap size={18} color="#fff" fill="#fff" />
              </div>
              <div className="footer-brand-name">
                BoostLink<span>Pro</span>
              </div>
              <p className="footer-desc">
                Instagram automation built for creators, sellers, and agencies.
                Turn comments into conversions — automatically.
              </p>
            </div>

            {columns.map((col) => (
              <div key={col.title}>
                <p className="footer-col-title">{col.title}</p>
                <div className="footer-links">
                  {col.links.map(([label, href]) =>
                    href.startsWith("mailto:") ? (
                      <a key={label} href={href} className="footer-link">
                        {label}
                      </a>
                    ) : (
                      <Link key={label} href={href} className="footer-link">
                        {label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <p className="footer-bottom-text">
              © 2026 BoostLink Pro. All rights reserved.
            </p>
            <p className="footer-bottom-text">
              Built with care for Instagram creators worldwide
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
