"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthPageChrome } from "@/components/shells/AuthPageChrome";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function getFriendlyError(message: string) {
    if (message.toLowerCase().includes("invalid login")) {
      return "Invalid email or password.";
    }
    return message;
  }

  useEffect(() => {
    async function redirectAuthenticatedUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    }
    redirectAuthenticatedUser();
  }, [router, supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(getFriendlyError(signInError.message));
      setIsLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <AuthPageChrome alternate={{ href: "/register", label: "Create account" }}>
      <div className="auth-shell rounded-[var(--si-radius-lg)]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.03] font-display text-lg font-semibold text-white shadow-lg">
            S
          </div>
          <p className="auth-eyebrow mt-5">StudyIntel</p>
          <h1 className="auth-title font-display text-3xl text-white sm:text-4xl">
            Welcome back
          </h1>
          <p className="auth-subtitle">
            Log in to continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="teacher-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control w-full"
              placeholder="you@example.com"
            />
          </div>

          <div className="teacher-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control w-full"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/35 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 text-sm tracking-wide disabled:opacity-60"
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-links mt-6 text-sm">
          No account?{" "}
          <Link href="/register" className="font-medium text-cyan-200/90 hover:text-white">
            Create one
          </Link>
        </p>
      </div>
    </AuthPageChrome>
  );
}
