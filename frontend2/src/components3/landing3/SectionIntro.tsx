import type { CSSProperties, ReactNode } from "react";
import {
  sectionCopyStyle,
  sectionEyebrowStyle,
  sectionTitleStyle,
} from "./landingTheme";

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  align?: "left" | "center";
  titleStyle?: CSSProperties;
  descriptionStyle?: CSSProperties;
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  titleStyle,
  descriptionStyle,
}: SectionIntroProps) {
  const centered = align === "center";
  return (
    <div style={{ textAlign: align, marginBottom: 56 }}>
      <p style={sectionEyebrowStyle}>{eyebrow}</p>
      <h2
        style={{
          ...sectionTitleStyle,
          ...(centered
            ? { maxWidth: 840, marginLeft: "auto", marginRight: "auto" }
            : {}),
          ...titleStyle,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          ...sectionCopyStyle,
          ...(centered ? { margin: "0 auto" } : {}),
          ...descriptionStyle,
        }}
      >
        {description}
      </p>
    </div>
  );
}
