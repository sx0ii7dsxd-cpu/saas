import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="glass w-full max-w-4xl p-12 text-center space-y-8 rounded-2xl">
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-2xl font-semibold shadow-lg">
          S
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
            Welcome to StudyIntel 🚀
          </h1>

          <p className="text-gray-400 max-w-2xl text-base sm:text-lg">
            Smart study tracker with AI, leaderboard, and insights.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mt-8">
          <Link href="/login">
            <button className="btn px-6 py-2 w-full sm:w-auto">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="btn btn-primary px-6 py-2 w-full sm:w-auto">
              Register
            </button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Built for focused students 🚀
        </p>

      </div>
    </main>
  );
}
