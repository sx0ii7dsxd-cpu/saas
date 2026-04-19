import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalDocShell } from "@/components/legal/LegalDocShell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How StudyIntel handles account data, product usage, and communications.",
};

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-8 border-b border-white/10 pb-2 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <LegalDocShell title="Privacy policy">
      <p className="text-white/55">
        Last updated: April 19, 2026. This page describes how StudyIntel treats
        information in the current product preview. When paid billing launches,
        we may publish an expanded policy and notify active accounts.
      </p>

      <H2>What we collect</H2>
      <p>
        To run the service we process account details you provide (such as email
        address), basic profile fields used in the app (like display name and
        school affiliation where applicable), and content you create inside
        StudyIntel (tasks, completions, and related timestamps). Authentication
        and storage are handled through Supabase; their infrastructure may
        process technical metadata required to secure sessions and prevent abuse.
      </p>

      <H2>How we use data</H2>
      <p>
        We use this information to authenticate you, render your dashboard,
        compute leaderboards and streaks for your cohort, and improve reliability
        of the product. We do not sell personal data. We do not use your study
        content to train public machine learning models.
      </p>

      <H2>Retention & deletion</H2>
      <p>
        We retain data while your account exists and for a short operational
        window afterward for abuse prevention and backups. You can request
        deletion of personal data by contacting us; some records may be retained
        where required by law.
      </p>

      <H2>Contact</H2>
      <p>
        Questions about this policy:{" "}
        <a
          href="mailto:hello@studyintel.com?subject=Privacy%20question"
          className="font-medium text-cyan-200/90 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          hello@studyintel.com
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
