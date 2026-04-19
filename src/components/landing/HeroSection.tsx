"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

/** Deterministic “particles” for SSR-safe layout */
const PARTICLES = [
  { x: 6, y: 14, s: 2.2, o: 0.35, d: 0 },
  { x: 12, y: 62, s: 1.4, o: 0.22, d: 1.2 },
  { x: 18, y: 38, s: 1.8, o: 0.28, d: 0.6 },
  { x: 24, y: 78, s: 1.2, o: 0.18, d: 2.1 },
  { x: 31, y: 22, s: 2.6, o: 0.32, d: 0.9 },
  { x: 38, y: 54, s: 1.5, o: 0.2, d: 1.5 },
  { x: 44, y: 11, s: 1.1, o: 0.16, d: 0.3 },
  { x: 52, y: 44, s: 2.1, o: 0.26, d: 1.1 },
  { x: 58, y: 72, s: 1.3, o: 0.19, d: 2.4 },
  { x: 66, y: 28, s: 1.9, o: 0.3, d: 0.45 },
  { x: 72, y: 58, s: 1.6, o: 0.21, d: 1.7 },
  { x: 78, y: 16, s: 1.2, o: 0.17, d: 0.15 },
  { x: 84, y: 48, s: 2.4, o: 0.33, d: 1.35 },
  { x: 90, y: 82, s: 1.35, o: 0.2, d: 2.0 },
  { x: 15, y: 88, s: 1.7, o: 0.24, d: 1.0 },
  { x: 55, y: 8, s: 1.45, o: 0.18, d: 0.75 },
  { x: 93, y: 34, s: 2.0, o: 0.27, d: 1.55 },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.01 : 0.65, ease: easeOut },
      },
    }),
    [reduceMotion],
  );

  const stagger = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.09,
          delayChildren: reduceMotion ? 0 : 0.06,
        },
      },
    }),
    [reduceMotion],
  );

  const listStagger = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.07,
          delayChildren: reduceMotion ? 0 : 0.05,
        },
      },
    }),
    [reduceMotion],
  );

  return (
    <section
      className="relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden px-5 pb-16 pt-[calc(var(--si-nav-h)+4.25rem)] sm:px-8 sm:pb-20 sm:pt-[calc(var(--si-nav-h)+4.75rem)] md:px-10"
      aria-labelledby="si-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 si-hero-mesh" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] mix-blend-screen si-hero-grid"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-[5] si-hero-grain"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 -z-[8]" aria-hidden>
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-cyan-200/25 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s * 4,
              height: p.s * 4,
              opacity: p.o,
            }}
            initial={false}
            animate={
              reduceMotion
                ? {}
                : {
                    y: [0, -10, 0],
                    opacity: [p.o * 0.7, p.o, p.o * 0.75],
                  }
            }
            transition={{
              duration: 10 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.d,
            }}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
        <motion.div
          className="flex w-full flex-1 flex-col items-start space-y-8 text-left lg:max-w-[min(100%,36rem)]"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Study intelligence
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full max-w-xl space-y-5">
            <h1
              id="si-hero-heading"
              className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,3.6vw,3.75rem)] lg:leading-[1.06] xl:text-6xl"
            >
              Focus that compounds.{" "}
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300/90 bg-clip-text text-transparent">
                Outcomes you can prove.
              </span>
            </h1>
            <p className="text-pretty text-base leading-relaxed text-[color:var(--si-text-muted)] sm:text-lg">
              StudyIntel unifies tracking, school leaderboards, and AI-assisted
              planning so every session ladders into measurable progress—not
              just hours logged.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex w-full max-w-xl flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="inline-flex"
            >
              <Link
                href="/register"
                className="si-cta-primary inline-flex min-h-[48px] min-w-[168px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.22)] transition-[box-shadow,transform]"
              >
                Start free
                <span aria-hidden className="text-base leading-none">
                  ↗
                </span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.015, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 460, damping: 24 }}
              className="inline-flex"
            >
              <Link
                href="/login"
                className="si-cta-ghost inline-flex min-h-[48px] min-w-[148px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:border-cyan-300/35 hover:bg-white/[0.06]"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={listStagger}
            className="flex w-full max-w-xl flex-col gap-3 border-t border-white/10 pt-7 text-sm text-[color:var(--si-text-muted)] sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3"
          >
            {[
              "AI task breakdowns",
              "Cohort leaderboards",
              "Streak-aware profiles",
            ].map((label) => (
              <motion.li
                key={label}
                variants={fadeUp}
                className="flex items-center gap-2"
                whileHover={
                  reduceMotion ? undefined : { x: 3, color: "rgba(248,250,252,0.92)" }
                }
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-cyan-400/35 bg-cyan-400/10 text-[10px] font-bold text-cyan-100">
                  ✓
                </span>
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative flex flex-1 justify-center lg:justify-end"
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: easeOut, delay: 0.15 }}
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/25 via-transparent to-fuchsia-500/20 blur-3xl" />
            <motion.div
              className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-6 pt-7 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8 sm:pt-9"
              whileHover={
                reduceMotion ? undefined : { rotateX: 2, rotateY: -3, scale: 1.01 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="mb-6 flex min-h-[2rem] items-center justify-between gap-4 pr-1">
                <div className="flex shrink-0 items-center gap-2 pl-0.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                </div>
                <span className="shrink-0 pt-0.5 text-right text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-white/50">
                  Live surface
                </span>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Today
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold leading-none tracking-tight text-white sm:text-4xl">
                      2h 24m
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold leading-none text-emerald-100">
                    +18% vs avg
                  </span>
                </div>
                <div className="grid gap-2">
                  {[72, 54, 88, 63].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]"
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={reduceMotion ? false : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease: easeOut }}
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300/90 to-sky-500/85"
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={reduceMotion ? false : { width: `${w}%` }}
                        transition={{ delay: 0.55 + i * 0.1, duration: 0.85, ease: easeOut }}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
                    Next best move
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Tighten your review block: 25 minutes on weak topics, then 10
                    minutes of recall checks.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 0.55, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
          Scroll
          <motion.span
            className="block h-8 w-px rounded-full bg-gradient-to-b from-white/50 to-transparent"
            animate={reduceMotion ? undefined : { scaleY: [0.6, 1, 0.6], opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
