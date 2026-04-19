"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#footer", label: "Company" },
] as const;

const easeOut = [0.16, 1, 0.3, 1] as const;

export function LandingNav() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 320, damping: 32, mass: 0.9 });
  const springY = useSpring(mouseY, { stiffness: 320, damping: 32, mass: 0.9 });
  const sheenX = useTransform(springX, (v) => `${v * 100}%`);
  const sheenY = useTransform(springY, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.14), transparent 62%)`;

  useEffect(() => {
    mouseX.set(0.52);
    mouseY.set(0.34);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    const onHash = () => closeMenu();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [closeMenu]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  function onNavPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }

  function onNavPointerLeave() {
    mouseX.set(0.5);
    mouseY.set(0.35);
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[rgba(4,7,14,0.62)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-2xl supports-[backdrop-filter]:bg-[rgba(4,7,14,0.42)]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      initial={reduceMotion ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: easeOut }}
      onPointerMove={onNavPointerMove}
      onPointerLeave={onNavPointerLeave}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: sheen,
          opacity: scrolled ? 0.75 : 0.42,
        }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
        initial={false}
        animate={{ opacity: scrolled ? 0.9 : 0.35, scaleX: scrolled ? 1 : 0.92 }}
        transition={{ duration: 0.35, ease: easeOut }}
      />

      <div className="relative mx-auto flex h-[var(--si-nav-h)] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 md:px-10">
        <Link
          href="/"
          className="group inline-flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-xl py-2 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(4,7,14,0.2)] sm:flex-initial sm:gap-3 sm:pr-2"
          onClick={closeMenu}
        >
          <motion.span
            className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.12] to-white/[0.02] shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            whileHover={reduceMotion ? undefined : { scale: 1.04, rotate: -1.5 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-cyan-300/25 via-transparent to-fuchsia-500/15 opacity-80" />
            <span className="relative font-display text-sm font-semibold tracking-tight text-white">
              S
            </span>
          </motion.span>
          <span className="max-w-[10rem] truncate font-display text-[15px] font-semibold tracking-tight text-white/95 sm:max-w-none sm:text-base">
            StudyIntel
            <span className="ml-0.5 inline shrink-0 text-cyan-200/70 transition-transform duration-300 group-hover:translate-x-0.5 sm:ml-1">
              ↗
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <motion.div key={item.href} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
              <Link
                href={item.href}
                className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 transition duration-200 ease-out group-hover:scale-x-100 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/login"
              className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-cyan-300/30 hover:bg-white/[0.06] hover:text-white"
            >
              Sign in
            </Link>
          </motion.div>
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -1, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <Link
              href="/register"
              className="si-cta-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_44px_rgba(34,211,238,0.18)]"
            >
              Start free
            </Link>
          </motion.div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              href="/register"
              className="si-cta-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_14px_36px_rgba(34,211,238,0.16)] sm:text-sm"
            >
              Start
            </Link>
          </motion.div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md outline-none transition-colors hover:border-cyan-300/25 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => {
              setOpen((v) => {
                const next = !v;
                if (!next) {
                  window.setTimeout(() => closeBtnRef.current?.focus(), 0);
                }
                return next;
              });
            }}
            ref={closeBtnRef}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-[18px] w-[18px]">
              <motion.span
                className="absolute left-0 top-[3px] h-0.5 w-[18px] rounded-full bg-white/90"
                animate={{
                  rotate: open ? 45 : 0,
                  y: open ? 5 : 0,
                }}
                transition={{ duration: 0.22, ease: easeOut }}
              />
              <motion.span
                className="absolute left-0 top-[9px] h-0.5 w-[18px] rounded-full bg-white/90"
                animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.6 : 1 }}
                transition={{ duration: 0.16, ease: easeOut }}
              />
              <motion.span
                className="absolute left-0 top-[15px] h-0.5 w-[18px] rounded-full bg-white/90"
                animate={{
                  rotate: open ? -45 : 0,
                  y: open ? -5 : 0,
                }}
                transition={{ duration: 0.22, ease: easeOut }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeMenu}
            />
            <motion.div
              id={menuId}
              className="fixed left-5 right-5 top-[calc(var(--si-nav-h)+env(safe-area-inset-top)+12px)] z-50 overflow-hidden rounded-3xl border border-white/12 bg-[rgba(6,9,19,0.92)] shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:left-8 sm:right-8 md:hidden"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.26, ease: easeOut }}
            >
              <div className="divide-y divide-white/[0.08] px-2 py-2">
                {NAV_LINKS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.04 + i * 0.05, duration: 0.25, ease: easeOut }}
                  >
                    <Link
                      href={item.href}
                      ref={i === 0 ? firstLinkRef : undefined}
                      className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/[0.05]"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="grid gap-2 p-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.25, ease: easeOut }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/[0.07]"
                    onClick={closeMenu}
                  >
                    Sign in
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
