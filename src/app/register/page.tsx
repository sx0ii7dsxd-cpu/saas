"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-10 text-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg font-semibold text-white">
            S
          </div>
          <p className="mt-5 text-sm font-medium text-gray-500">StudyIntel</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Start tracking smarter study sessions today.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              placeholder="Create a password"
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
              onChange={(event) => setPassword(event.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">
              Use at least 6 characters.
            </p>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
