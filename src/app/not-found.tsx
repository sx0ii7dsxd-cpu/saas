import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 si-hero-mesh opacity-40"
        aria-hidden
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
        404
      </p>
      <h1 className="font-display max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        This page drifted off your study plan.
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-base">
        The URL may be wrong, or the page may have moved. Head home and pick up
        where you left off.
      </p>
      <Link
        href="/"
        className="si-cta-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.2)]"
      >
        Back to StudyIntel
      </Link>
    </main>
  );
}
