"use client";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SectionIntro from "../SectionIntro";
import { landingContainerStyle, sectionPadding } from "../landingTheme";

const faqs = [
  {
    q: "How does the comment-to-DM automation work?",
    a: "Simply set a keyword on any Instagram post or reel. When someone comments with that keyword, they instantly receive your personalized DM — completely automated, no manual work required.",
  },
  {
    q: "Can I sell digital products directly through Instagram?",
    a: "Yes! Upload your PDF, course, or template. Buyers pay via Stripe and automatically receive their download link in DMs — zero manual delivery needed.",
  },
  {
    q: "Is this approved by Meta/Instagram?",
    a: "Absolutely. We use official Meta-approved Instagram Graph API, ensuring your account stays safe and compliant with Instagram's policies.",
  },
  {
    q: "What happens if I exceed my plan's DM limit?",
    a: "You'll receive a notification when approaching your limit. You can upgrade anytime to increase your monthly DM capacity without losing any data.",
  },
  {
    q: "Can I customize the automated DM messages?",
    a: "Yes! Each keyword trigger can have its own personalized message. You can include variables, links, emojis, and create different responses for different keywords.",
  },
  {
    q: "Do I need technical skills to set this up?",
    a: "Not at all. Our dashboard is designed for creators, not developers. Set up your first automation in under 2 minutes — no coding required.",
  },
];

export default function Testimonials() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".faq-item");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.07 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .faq-section {
          padding: ${sectionPadding}; 
          background: var(--bg2);
          position: relative; 
          overflow: hidden;
        }
        .faq-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,77,0,.08) 1px, transparent 1px);
          background-size: 40px 40px; 
          opacity: .15;
        }
        
        .faq-list {
          max-width: 840px;
          margin: 0 auto 48px;
        }
        
        .faq-item {
          opacity: 0; 
          transform: translateY(20px);
          transition: opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1);
          margin-bottom: 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--card);
          overflow: hidden;
        }
        
        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 26px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background .2s;
        }
        .faq-question:hover {
          background: rgba(255,77,0,.02);
        }
        
        .faq-q-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; 
          font-weight: 700;
          color: var(--text1); 
          line-height: 1.4;
          flex: 1;
        }
        
        .faq-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,77,0,.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform .3s, background .2s;
        }
        .faq-item.open .faq-icon {
          transform: rotate(180deg);
          background: rgba(255,77,0,.12);
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height .4s cubic-bezier(.16,1,.3,1), padding .4s cubic-bezier(.16,1,.3,1);
        }
        .faq-item.open .faq-answer {
          max-height: 500px;
        }
        
        .faq-a-text {
          padding: 0 26px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px; 
          line-height: 1.75; 
          color: var(--text3);
        }
        
        .faq-cta { 
          text-align: center; 
        }
        
        .faq-explore-link {
          display: inline-flex; 
          align-items: center; 
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; 
          font-weight: 600;
          color: #FF4D00;
          border: 2px solid rgba(255,77,0,.2);
          background: rgba(255,77,0,.04);
          transition: all .2s;
        }
        .faq-explore-link:hover {
          border-color: rgba(255,77,0,.35);
          background: rgba(255,77,0,.08);
          transform: translateY(-2px);
        }
        
        @media (max-width: 580px) { 
          .faq-q-text { font-size: 15px; }
          .faq-a-text { font-size: 14px; }
        }
      `}</style>

      <section className="faq-section">
        <div className="faq-bg" />
        <div style={landingContainerStyle}>
          <SectionIntro
            eyebrow="FAQs"
            title="Everything you need to know"
            description="Quick answers to common questions about Instagram automation and our platform."
          />

          <div ref={ref} className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openIndex === i ? "open" : ""}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <div className="faq-icon">
                    <ChevronDown size={18} color="#FF4D00" strokeWidth={2.5} />
                  </div>
                </button>
                <div className="faq-answer">
                  <p className="faq-a-text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <Link href="/faqs" className="faq-explore-link">
              Explore all FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
