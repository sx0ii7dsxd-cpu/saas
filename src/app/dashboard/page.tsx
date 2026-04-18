import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function logout() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10 text-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col justify-between gap-4 rounded bg-white p-6 shadow-md sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">StudyIntel</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Dashboard
            </h1>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-50"
            >
              Logout
            </button>
          </form>
        </header>

        <section className="rounded bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Signed in as</p>
          <p className="mt-2 break-all text-xl font-semibold text-black">
            {user.email}
          </p>
        </section>
      </div>
    </main>
  );
}
