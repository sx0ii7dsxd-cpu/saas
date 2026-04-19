"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

type AuthPageChromeProps = {
  children: React.ReactNode;
  alternate: { href: string; label: string };
};

export function AuthPageChrome({ children, alternate }: AuthPageChromeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 si-hero-mesh opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-[9] opacity-[0.35] mix-blend-screen si-hero-grid"
        aria-hidden
      />

      <header className="absolute left-0 right-0 top-0 z-10 border-b border-white/[0.07] bg-[rgba(4,7,14,0.55)] backdrop-blur-xl">
        <div className="mx-auto flex h-[var(--si-nav-h)] max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="font-display text-sm font-semibold tracking-tight text-white/90 transition-colors hover:text-white"
          >
            ← StudyIntel
          </Link>
          <Link
            href={alternate.href}
            className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-cyan-300/30 hover:text-white sm:text-sm"
          >
            {alternate.label}
          </Link>
        </div>
      </header>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: easeOut }}
      >
        {children}
      </motion.div>

      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.06] bg-[rgba(4,7,14,0.35)] px-4 py-4 text-center text-[11px] text-white/40 backdrop-blur-md sm:text-xs">
        <Link href="/privacy" className="text-white/50 transition-colors hover:text-white">
          Privacy
        </Link>
        <span className="mx-2 text-white/25">·</span>
        <Link href="/terms" className="text-white/50 transition-colors hover:text-white">
          Terms
        </Link>
      </footer>
    </main>
  );
}
