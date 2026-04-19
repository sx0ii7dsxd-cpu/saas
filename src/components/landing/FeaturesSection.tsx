"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        className="stroke-cyan-200/90"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 8.5 13.2 12l3.3 1.2-3.3 1.2L12 17.5l-1.2-4.1-3.3-1.2 3.3-1.2L12 8.5Z"
        className="fill-cyan-300/35 stroke-cyan-200/70"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M7 4h10v3a5 5 0 0 1-10 0V4Z"
        className="stroke-cyan-200/90"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"
        className="stroke-cyan-200/70"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 18h6M10 15h4M8 21h8"
        className="stroke-cyan-200/80"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M8 7h12M8 12h12M8 17h12"
        className="stroke-cyan-200/90"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 7h.01M5 12h.01M5 17h.01"
        className="stroke-fuchsia-200/80"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFlame() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M12 3s3.5 3.2 3.5 7a3.5 3.5 0 1 1-7 0c0-2.2 1.2-4.1 2.2-5.4.4-.6.8-1.1 1.3-1.6Z"
        className="stroke-orange-200/85"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5c-1.2 1.4-2 2.6-2 4a2 2 0 0 0 4 0c0-1.1-.6-2.2-1.4-3.2l-.6-.8Z"
        className="fill-orange-300/20 stroke-orange-200/70"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRadar() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M12 21a9 9 0 1 0-9-9"
        className="stroke-cyan-200/85"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 15a3 3 0 1 0-3-3"
        className="stroke-cyan-200/70"
        strokeWidth="1.6"
      />
      <path
        d="M12 12h.01"
        className="stroke-fuchsia-200/90"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    title: "AI task planning",
    description:
      "Turn any topic into a crisp study plan—structured tasks you can execute immediately, not vague to-dos.",
    icon: IconSpark,
    tag: "New",
    span: "md:col-span-2 lg:col-span-3",
  },
  {
    title: "School leaderboards",
    description:
      "Healthy competition inside your cohort. Rankings update as students complete work—no manual scorekeeping.",
    icon: IconTrophy,
    tag: "Social",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Task system that respects reality",
    description:
      "Capture work fast, check it off faster, and keep history that actually reflects what you finished.",
    icon: IconList,
    tag: "Core",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Streaks that motivate",
    description:
      "Lightweight streak logic rewards consistency—without turning your study life into a guilt trip.",
    icon: IconFlame,
    tag: "Habits",
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    title: "Signals, not noise",
    description:
      "A dashboard that highlights momentum: what moved today, what’s slipping, and what to do next.",
    icon: IconRadar,
    tag: "Insight",
    span: "md:col-span-2 lg:col-span-3",
  },
] as const;

export function FeaturesSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.01 : 0.55, ease: easeOut },
      },
    }),
    [reduceMotion],
  );

  const stagger = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.08,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
    }),
    [reduceMotion],
  );

  const cardReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.01 : 0.5, ease: easeOut },
      },
    }),
    [reduceMotion],
  );

  return (
    <section
      id="features"
      className="si-anchor-target relative border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28"
      aria-labelledby="si-features-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
        <div className="absolute left-1/2 top-24 h-[420px] w-[min(920px,100%)] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -10% 0px" }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80 sm:text-xs"
          >
            Product
          </motion.p>
          <motion.h2
            id="si-features-heading"
            variants={fadeUp}
            className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.65rem] md:leading-[1.08]"
          >
            Everything you need to run a focused study practice.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-[color:var(--si-text-muted)] sm:text-lg"
          >
            StudyIntel is built like infrastructure: fast inputs, clear status,
            and surfaces that make progress legible—whether you’re a solo
            student or part of a school cohort.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                variants={cardReveal}
                className={`group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl sm:p-7 ${f.span}`}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -4,
                        transition: { type: "spring", stiffness: 420, damping: 26 },
                      }
                }
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(700px circle at 20% 0%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(500px circle at 90% 20%, rgba(168,85,247,0.12), transparent 52%)",
                  }}
                />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <Icon />
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      {f.tag}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-[0.95rem]">
                      {f.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-semibold text-cyan-100/70 opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                    <span className="h-px w-6 rounded-full bg-gradient-to-r from-cyan-300/70 to-transparent" />
                    Crafted for clarity
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:p-7"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: easeOut }}
        >
          <div>
            <p className="font-display text-lg font-semibold text-white sm:text-xl">
              Prefer to feel it in the product?
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-base">
              Create a free account, invite your rhythm, and ship a week of real
              tasks—no credit card, no setup theater.
            </p>
          </div>
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="si-cta-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_44px_rgba(34,211,238,0.18)] sm:w-auto"
            >
              Start free
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
