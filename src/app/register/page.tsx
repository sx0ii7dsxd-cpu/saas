"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AuthPageChrome } from "@/components/shells/AuthPageChrome";

export default function RegisterPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function getFriendlyError(message: string) {
    if (message.toLowerCase().includes("rate limit")) {
      return "Signup email limit reached. Please wait a few minutes, then try again or use a different email.";
    }

    return message;
  }

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(getFriendlyError(error.message));
      setIsLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("User not created.");
      setIsLoading(false);
      return;
    }

    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .select("id")
      .limit(1)
      .single();

    if (schoolError || !school) {
      setError("No school found.");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      school_id: school.id,
      username: email.split("@")[0],
      role: "student",
    });

    if (profileError) {
      setError(profileError.message);
      setIsLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <AuthPageChrome alternate={{ href: "/login", label: "Sign in" }}>
      <div className="auth-shell rounded-[var(--si-radius-lg)]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.03] font-display text-lg font-semibold text-white shadow-lg">
            S
          </div>
          <p className="auth-eyebrow mt-5">StudyIntel</p>
          <h1 className="auth-title font-display text-3xl text-white sm:text-4xl">
            Create account
          </h1>
          <p className="auth-subtitle">
            Start tracking smarter study sessions today.
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="teacher-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              placeholder="you@example.com"
              className="form-control w-full"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="teacher-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              placeholder="Create a password"
              className="form-control w-full"
              onChange={(event) => setPassword(event.target.value)}
            />
            <span className="text-xs text-[color:var(--si-text-soft)]">
              Use at least 6 characters.
            </span>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-400/35 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <p className="text-center text-[11px] leading-relaxed text-[color:var(--si-text-muted)] sm:text-xs">
            By creating an account you agree to the{" "}
            <Link href="/terms" className="text-cyan-200/90 hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-cyan-200/90 hover:text-white">
              Privacy policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 text-sm font-semibold tracking-wide disabled:opacity-60"
          >
            {isLoading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="auth-links mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-200/90 hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </AuthPageChrome>
  );
}
