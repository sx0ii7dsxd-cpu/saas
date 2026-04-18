"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="glass w-full max-w-md p-10 space-y-7 rounded-2xl">

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-xl font-semibold shadow-md">
            S
          </div>
          <p className="mt-4 text-sm text-gray-400">StudyIntel</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Log in to continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full mt-2 px-4 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full mt-2 px-4 py-2"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-2 text-sm tracking-wide"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-400 mt-2">
          No account?{" "}
          <Link
            href="/register"
            className="text-white underline hover:opacity-80"
          >
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
}
