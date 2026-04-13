import type { Metadata } from "next";
import Landingpage3 from "@/components3/landing3/LandingPage";

export const metadata: Metadata = {
  title: "BoostLinkPro | Instagram DM Automation for Creators and Sellers",
  description:
    "Automate Instagram comment-to-DM workflows, deliver offers faster, and run conversion-ready messaging flows with BoostLinkPro.",
  openGraph: {
    title: "BoostLinkPro | Instagram DM Automation",
    description:
      "Professional Instagram DM automation landing experience built for creators, sellers, and growth teams.",
    type: "website",
  },
};

export default function RootPage() {
  return <Landingpage3 />;
}
