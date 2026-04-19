import Link from "next/link";
import type { ReactNode } from "react";

export function LegalDocShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-14 sm:px-6 sm:py-20 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200/85 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> Home
        </Link>
        <article className="mt-8 rounded-[1.35rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:rounded-3xl sm:p-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-[color:var(--si-text-muted)] sm:text-[0.95rem]">
            {children}
          </div>
        </article>
      </div>
    </main>
  );
}
