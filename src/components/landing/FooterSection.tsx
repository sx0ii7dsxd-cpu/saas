"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const PRODUCT = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
] as const;

const COMPANY = [
  { href: "/#footer", label: "Overview" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function FooterSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.01 : 0.48, ease: easeOut },
      },
    }),
    [reduceMotion],
  );

  const stagger = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.06,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
    }),
    [reduceMotion],
  );

  return (
    <footer
      id="footer"
      className="si-anchor-target relative mt-4 border-t border-white/[0.06] px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20 md:px-10 md:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[min(420px,55vh)] bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          id="contact"
          className="si-anchor-target relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-7 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-3xl sm:p-9 md:p-10"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: easeOut }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/75 sm:text-xs">
                Campus & programs
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Let&apos;s design your rollout.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-base">
                Share your school, cohort size, and timeline—we&apos;ll follow up
                with seat options, a lightweight pilot plan, and success metrics
                that match how you already teach.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row">
              <motion.div
                className="flex-1"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <a
                  href="mailto:hello@studyintel.com?subject=Campus%20inquiry"
                  className="si-cta-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.2)]"
                >
                  Email the team
                </a>
              </motion.div>
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.015, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                transition={{ type: "spring", stiffness: 460, damping: 24 }}
              >
                <Link
                  href="/register"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:border-cyan-300/35 hover:bg-white/[0.07] sm:w-auto"
                >
                  Start with Starter
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-2 gap-10 gap-y-12 md:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
        >
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-xl py-1 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(4,7,14,0.35)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.12] to-white/[0.02] shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-[1.04]">
                <span className="font-display text-sm font-semibold text-white">
                  S
                </span>
              </span>
              <span className="font-display text-base font-semibold text-white">
                StudyIntel
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--si-text-muted)]">
              Study infrastructure for students who want proof—not vibes.
            </p>
          </motion.div>

          <motion.nav variants={fadeUp} aria-label="Product">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Product
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {PRODUCT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav variants={fadeUp} aria-label="Company">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Company
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {COMPANY.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Stay sharp
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--si-text-muted)]">
              Ship a week of real tasks. Upgrade when AI becomes part of your
              daily loop.
            </p>
            <motion.div
              className="mt-5"
              whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              <Link
                href="/register"
                className="si-cta-primary inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.18)]"
              >
                Start free
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-start sm:justify-between sm:text-sm"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: easeOut }}
        >
          <p>© {new Date().getFullYear()} StudyIntel. All rights reserved.</p>
          <div
            id="legal-notice"
            className="flex max-w-md flex-col gap-3 leading-relaxed sm:items-end sm:text-right"
          >
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-white/55">
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </div>
            <p className="text-white/40">
              Billing may introduce additional disclosures; until then, keep
              cohort data within your school&apos;s norms.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
