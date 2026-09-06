import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource-variable/source-serif-4";
import "./globals.css";

export const metadata: Metadata = {
  title: "TARAONCHAIN — ON-CHAIN FORENSICS · CASE ARCHIVE",
  description:
    "Privacy-first on-chain investigation archive. Independent case files — SLINK (R-0905) and SHARAV (S-0830) — every entity, funding trail and figure from the verified reports, walkable as interactive evidence graphs in your browser. Local archive, zero telemetry.",
};

export const viewport: Viewport = {
  themeColor: "#080704",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
