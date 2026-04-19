import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalDocShell } from "@/components/legal/LegalDocShell";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms and conditions for using the StudyIntel service.",
};

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-8 border-b border-white/10 pb-2 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
      {children}
    </h2>
  );
}

export default function TermsPage() {
  return (
    <LegalDocShell title="Terms of use">
      <p className="text-white/55">
        Last updated: April 19, 2026. By accessing StudyIntel you agree to these
        terms. If you do not agree, do not use the service.
      </p>

      <H2>Eligibility & accounts</H2>
      <p>
        You are responsible for maintaining the confidentiality of your login
        credentials and for activity under your account. You must provide
        accurate information and keep it reasonably up to date.
      </p>

      <H2>Acceptable use</H2>
      <p>
        You may not misuse StudyIntel, attempt to access other users&apos; data,
        disrupt the service, scrape at unreasonable scale, or use the product in
        violation of applicable law. We may suspend accounts involved in abuse or
        security risk.
      </p>

      <H2>Disclaimers</H2>
      <p>
        StudyIntel is provided &quot;as is&quot; without warranties of any kind,
        express or implied. AI-assisted features may produce imperfect outputs;
        you remain responsible for academic integrity and verifying any generated
        material before relying on it.
      </p>

      <H2>Limitation of liability</H2>
      <p>
        To the maximum extent permitted by law, StudyIntel and its operators will
        not be liable for indirect, incidental, special, consequential, or
        punitive damages, or for loss of profits, data, or goodwill, arising from
        your use of the service.
      </p>

      <H2>Changes</H2>
      <p>
        We may update these terms as the product evolves. Continued use after
        changes constitutes acceptance of the revised terms. Material changes may
        be announced in-product or by email where appropriate.
      </p>

      <H2>Contact</H2>
      <p>
        Legal questions:{" "}
        <a
          href="mailto:hello@studyintel.com?subject=Terms%20question"
          className="font-medium text-cyan-200/90 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          hello@studyintel.com
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
