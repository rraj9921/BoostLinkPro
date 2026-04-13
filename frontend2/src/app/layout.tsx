import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components3/shared/QueryProvider";

export const metadata: Metadata = {
  title: "BoostLink Pro — Grow, Automate & Monetize on Instagram",
  description: "The complete creator toolkit. Automate Instagram DMs, sell digital products, build your bio link store.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F0F0F0",
                fontFamily: "Instrument Sans, sans-serif",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
