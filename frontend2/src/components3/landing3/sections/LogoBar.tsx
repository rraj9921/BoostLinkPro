import { landingContainerStyle } from "../landingTheme";

const badges = [
  { dot: "#FF4D00", label: "Instagram Graph API" },
  { dot: "#10B981", label: "Stripe Payments" },
  { dot: "#FF4D00", label: "Keyword DM triggers" },
  { dot: "#8B5CF6", label: "Real-time automation" },
  { dot: "#0EA5E9", label: "24/7 uptime" },
  { dot: "#F59E0B", label: "Works worldwide" },
  { dot: "#10B981", label: "Digital product delivery" },
  { dot: "#FF4D00", label: "Bio link store" },
];

export default function LogoBar() {
  return (
    <>
      <style>{`
        .lb-outer { 
          background: #F8F9FA; 
          padding: 80px 0 64px; 
          overflow: hidden; 
          position: relative; 
        }
        .lb-divider {
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,77,0,.15) 30%, rgba(255,77,0,.15) 70%, transparent);
        }
        .lb-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; 
          font-weight: 600;
          letter-spacing: .06em; 
          text-transform: uppercase;
          color: rgba(0,0,0,.4); 
          text-align: center;
          margin-bottom: 32px;
        }
        .lb-track {
          display: flex; gap: 14px; width: max-content;
          animation: lbScroll 35s linear infinite;
        }
        .lb-track:hover { animation-play-state: paused; }
        @keyframes lbScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .lb-chip {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 22px; 
          border-radius: 99px;
          border: 1px solid rgba(0,0,0,.08);
          background: #fff; 
          white-space: nowrap;
          transition: border-color .2s, background .2s, transform .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .lb-chip:hover { 
          border-color: rgba(255,77,0,.3); 
          background: rgba(255,77,0,.02);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .lb-chip-dot { 
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          flex-shrink: 0;
        }
        .lb-chip-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; 
          font-weight: 600; 
          color: rgba(0,0,0,.75);
        }
        .lb-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 120px;
          background: linear-gradient(90deg, #F8F9FA, transparent);
          pointer-events: none; z-index: 1;
        }
        .lb-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 120px;
          background: linear-gradient(270deg, #F8F9FA, transparent);
          pointer-events: none; z-index: 1;
        }
      `}</style>
      <section className="lb-outer">
        <div className="lb-divider" />
        <div style={landingContainerStyle}>
          <p className="lb-label">
            Built on trusted infrastructure · Serving creators worldwide
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <div className="lb-fade-l" />
          <div className="lb-fade-r" />
          <div style={{ overflow: "hidden" }}>
            <div className="lb-track">
              {[...badges, ...badges].map((b, i) => (
                <div key={i} className="lb-chip">
                  <span className="lb-chip-dot" style={{ background: b.dot }} />
                  <span className="lb-chip-text">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
