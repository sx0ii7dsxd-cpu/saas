import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-10 text-black">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 text-center shadow-md sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-black text-xl font-semibold text-white">
          S
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-black">
            Welcome to StudyIntel
          </h1>

          <p className="max-w-xl text-base leading-7 text-gray-600">
            Smart study tracker with AI, leaderboard, and insights.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-50"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
