import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://studyintel.com"),
  title: {
    default: "StudyIntel — Focus that compounds",
    template: "%s · StudyIntel",
  },
  description:
    "Study tracker with AI planning, school leaderboards, and streak-aware profiles—built for students who want proof, not vibes.",
  openGraph: {
    title: "StudyIntel",
    description:
      "Smart study tracking with AI, leaderboards, and insights for serious students.",
    type: "website",
  },
};

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen text-white">{children}</body>
    </html>
  );
}