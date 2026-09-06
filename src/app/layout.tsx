import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Project Consultant — Rough ideas to 20-section blueprints",
    template: "%s — AI Project Consultant",
  },
  description:
    "Turn rough app ideas into structured, editable 20-section technical blueprints. Clarifier asks ≤5 high-impact questions, Zod-validated generation via gpt-4o-mini, per-section regeneration, Executive / Technical / Complete views filter locally (no LLM re-call), and PDF export.",
  metadataBase: new URL("https://project-consultant.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Project Consultant — Rough ideas to 20-section blueprints",
    description:
      "Structured blueprints as Section records, not chat blobs. 20 validated sections, inline editing with 1s debounce, per-section AI regeneration, and filtered Executive/Technical/Complete PDF export.",
    url: "/",
    siteName: "AI Project Consultant",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Project Consultant — Rough ideas to 20-section blueprints",
    description:
      "From raw idea to technical blueprint: 20 sections, editable, exportable. Built with Next.js 15, Prisma, Auth.js, and gpt-4o-mini.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0FDFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
