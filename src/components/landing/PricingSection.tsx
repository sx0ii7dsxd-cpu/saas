"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

type Plan = {
  name: string;
  description: string;
  monthly: number;
  annual: number;
  href: string;
  cta: string;
  featured?: boolean;
  footnote?: string;
  bullets: readonly string[];
};

const PLANS: readonly Plan[] = [
  {
    name: "Starter",
    description: "For individuals getting serious about consistency.",
    monthly: 0,
    annual: 0,
    href: "/register",
    cta: "Start free",
    bullets: [
      "Tasks & completions",
      "School leaderboard",
      "Profile & streaks",
      "Core dashboard",
    ],
  },
  {
    name: "Plus",
    description: "For power students who want AI depth and faster loops.",
    monthly: 10,
    annual: 7,
    href: "/register",
    cta: "Get Plus",
    featured: true,
    footnote: "Higher AI limits · priority polish",
    bullets: [
      "Everything in Starter",
      "Expanded AI planning",
      "Smarter task suggestions",
      "Usage tuned for daily study",
    ],
  },
  {
    name: "Campus",
    description: "For cohorts and programs that need alignment at scale.",
    monthly: 0,
    annual: 0,
    href: "/#contact",
    cta: "Talk to us",
    bullets: [
      "Seat-based access",
      "Cohort reporting",
      "Admin-friendly rollout",
      "Dedicated onboarding",
    ],
  },
];

function CheckIcon() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
        <path
          d="M3.5 8.2 6.4 11l6.1-6.5"
          className="stroke-cyan-100"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PricingSection() {
  const reduceMotion = useReducedMotion();
  const [annual, setAnnual] = useState(true);

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.01 : 0.52, ease: easeOut },
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
          delayChildren: reduceMotion ? 0 : 0.05,
        },
      },
    }),
    [reduceMotion],
  );

  const cardReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
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
      id="pricing"
      className="si-anchor-target relative border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28"
      aria-labelledby="si-pricing-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent" />
        <div className="absolute right-[-10%] top-32 h-[380px] w-[min(520px,70vw)] rounded-full bg-fuchsia-500/10 blur-[100px]" />
        <div className="absolute bottom-10 left-[-8%] h-[320px] w-[min(480px,65vw)] rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -10% 0px" }}
        >
          <div className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-200/75 sm:text-xs"
            >
              Pricing
            </motion.p>
            <motion.h2
              id="si-pricing-heading"
              variants={fadeUp}
              className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.6rem] md:leading-[1.08]"
            >
              Simple plans. Serious leverage.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-[color:var(--si-text-muted)] sm:text-lg"
            >
              Start free, upgrade when AI and velocity become part of your daily
              workflow. Campus is built for programs that need shared visibility.
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            role="group"
            aria-label="Billing period"
          >
            {(
              [
                { id: false, label: "Monthly" },
                { id: true, label: "Annual" },
              ] as const
            ).map((opt) => (
              <button
                key={String(opt.id)}
                type="button"
                onClick={() => setAnnual(opt.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  annual === opt.id ? "text-slate-950" : "text-white/65 hover:text-white/90"
                }`}
              >
                {annual === opt.id && (
                  <motion.span
                    layoutId="pricing-billing-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 shadow-[0_12px_30px_rgba(34,211,238,0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-stretch"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
        >
          {PLANS.map((plan) => {
            const isCampus = plan.name === "Campus";
            const isFree = !isCampus && plan.monthly === 0;
            const price =
              isCampus ? null : annual ? plan.annual : plan.monthly;
            const showAnnualNote = !isCampus && plan.monthly > 0 && annual;

            return (
              <motion.article
                key={plan.name}
                variants={cardReveal}
                className={`relative flex flex-col rounded-[1.35rem] border p-7 sm:rounded-3xl sm:p-8 ${
                  plan.featured
                    ? "border-cyan-300/35 bg-gradient-to-b from-white/[0.11] to-cyan-400/[0.04] shadow-[0_28px_100px_rgba(34,211,238,0.18)] lg:-translate-y-1 lg:py-9"
                    : "border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
                } backdrop-blur-xl`}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: plan.featured ? -6 : -4,
                        transition: { type: "spring", stiffness: 380, damping: 24 },
                      }
                }
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-cyan-300/40 bg-[rgba(4,10,18,0.92)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                    Most popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-[0.95rem]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 border-b border-white/10 pb-6">
                  {isCampus ? (
                    <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Custom
                    </p>
                  ) : isFree ? (
                    <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      Free
                    </p>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={`${plan.name}-${annual}`}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                            transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: easeOut }}
                            className="inline-block"
                          >
                            ${price}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="text-sm font-medium text-white/50">/mo</span>
                    </div>
                  )}
                  {isFree && (
                    <p className="mt-2 text-sm text-[color:var(--si-text-muted)]">
                      Free forever for core workflows.
                    </p>
                  )}
                  {showAnnualNote && (
                    <p className="mt-2 text-sm text-cyan-100/70">
                      Billed annually · save vs monthly
                    </p>
                  )}
                  {isCampus && (
                    <p className="mt-2 text-sm text-[color:var(--si-text-muted)]">
                      Volume pricing and a rollout playbook.
                    </p>
                  )}
                  {plan.footnote && (
                    <p className="mt-3 text-xs font-medium text-white/45">
                      {plan.footnote}
                    </p>
                  )}
                </div>

                <ul className="mb-8 flex flex-col gap-3 text-sm text-white/85">
                  {plan.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <CheckIcon />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.href.startsWith("/#") ? (
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                      <Link
                        href={plan.href}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-cyan-300/35 hover:bg-white/[0.07]"
                      >
                        {plan.cta}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                      <Link
                        href={plan.href}
                        className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${
                          plan.featured
                            ? "si-cta-primary text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.22)]"
                            : "border border-white/15 bg-white/[0.04] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-cyan-300/35 hover:bg-white/[0.07]"
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-xs leading-relaxed text-white/40 sm:text-sm"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: easeOut }}
        >
          Prices reflect the product roadmap—billing may roll out in phases. You
          can always start on Starter at no cost.
        </motion.p>
      </div>
    </section>
  );
}
