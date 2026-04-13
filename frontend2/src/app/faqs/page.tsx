"use client";
import { useState } from "react";
import { ChevronDown, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components3/landing3/Navbar";
import Footer from "@/components3/landing3/sections/Footer";

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

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg2)" }}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        
        .faq-page {
          max-width: 920px;
          margin: 0 auto;
          padding: 120px 32px 80px;
        }
        
        .faq-header {
          text-align: center;
          margin-bottom: 64px;
        }
        
        .faq-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #FF4D00;
          margin-bottom: 16px;
        }
        
        .faq-title {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(32px, 4.5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text1);
          line-height: 1.1;
          margin-bottom: 16px;
        }
        
        .faq-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          line-height: 1.7;
          color: var(--text3);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .faq-list {
          margin-bottom: 80px;
        }
        
        .faq-item {
          margin-bottom: 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--card);
          overflow: hidden;
          transition: box-shadow .2s;
        }
        .faq-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
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
        
        .support-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 48px;
          margin-top: 64px;
        }
        
        .support-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--text1);
          margin-bottom: 8px;
          text-align: center;
        }
        
        .support-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: var(--text3);
          margin-bottom: 36px;
          text-align: center;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--text2);
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg2);
          color: var(--text1);
          border: 1.5px solid var(--border);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--text4);
        }
        
        .form-input:focus,
        .form-textarea:focus {
          border-color: #FF4D00;
          box-shadow: 0 0 0 4px rgba(255,77,0,.08);
        }
        
        .form-textarea {
          min-height: 140px;
          resize: vertical;
        }
        
        .form-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          padding: 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 32px rgba(255,77,0,.32);
          transition: all .2s cubic-bezier(.16,1,.3,1);
          margin-top: 8px;
        }
        
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 42px rgba(255,77,0,.44);
        }
        
        .form-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        
        @media (max-width: 640px) {
          .faq-page { padding: 60px 24px; }
          .form-grid { grid-template-columns: 1fr; }
          .support-section { padding: 32px 24px; }
          .faq-q-text { font-size: 15px; }
          .faq-a-text { font-size: 14px; }
        }
      `}</style>

        <div className="faq-page">
          <div className="faq-header">
            <p className="faq-eyebrow">Frequently Asked Questions</p>
            <h1 className="faq-title">Everything you need to know</h1>
            <p className="faq-subtitle">
              Find answers to common questions about Instagram automation, our
              platform, and how to get started.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openIndex === i ? "open" : ""}`}
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

          <div className="support-section">
            <h2 className="support-title">Still have questions?</h2>
            <p className="support-subtitle">
              Can't find the answer you're looking for? Send us a message and
              we'll get back to you soon.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us more about your question or issue..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
