import type { CSSProperties } from "react";

export const landingContainerStyle: CSSProperties = {
  maxWidth: 1160,
  margin: "0 auto",
  padding: "0 32px",
  position: "relative",
};

export const sectionPadding = "48px 0 92px";

export const brandGradient =
  "linear-gradient(135deg, #FF4D00 0%, #FF7A3D 100%)";
export const brandGlow = "0 16px 48px rgba(255,77,0,.28)";
export const darkPanel = "linear-gradient(180deg, #120C10 0%, #0E090C 100%)";
export const tintedPanel =
  "linear-gradient(180deg, color-mix(in srgb, var(--card) 96%, transparent), color-mix(in srgb, var(--bg2) 92%, transparent))";

export const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
`;

export const sectionEyebrowStyle: CSSProperties = {
  display: "inline-block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#FF4D00",
  marginBottom: 18,
};

export const sectionTitleStyle: CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "clamp(36px, 4.8vw, 62px)",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  color: "var(--text1)",
  lineHeight: 1.1,
  marginBottom: 20,
};

export const sectionCopyStyle: CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 19.5,
  lineHeight: 1.75,
  color: "var(--text2)",
  maxWidth: 680,
};
