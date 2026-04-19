"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
};

type Profile = {
  username?: string;
  role?: string;
  streak?: number;
  last_task_completed_at?: string;
  school?: string;
  completed_tasks_count?: number;
};

function panelClass() {
  return "rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8";
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const openTasks = useMemo(
    () => tasks.filter((t) => !t.is_completed).length,
    [tasks],
  );

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      setUserId(data.user.id);
      fetchProfile(data.user.id);
      fetchTasks(data.user.id);
    }
    loadUser();
  }, [router, supabase]);

  async function fetchProfile(currentUserId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "username, role, streak, last_task_completed_at, school, completed_tasks_count",
      )
      .eq("id", currentUserId)
      .single();

    if (!error && data) {
      let currentStreak = data.streak || 0;
      const lastCompleted = data.last_task_completed_at;

      const todayStr = new Date().toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (
        lastCompleted &&
        lastCompleted !== todayStr &&
        lastCompleted !== yesterdayStr &&
        currentStreak > 0
      ) {
        currentStreak = 0;
        await supabase
          .from("profiles")
          .update({ streak: 0 })
          .eq("id", currentUserId);
      }

      setProfile({ ...data, streak: currentStreak });

      if (data.school) {
        fetchLeaderboard(data.school);
      }
    }
  }

  async function fetchLeaderboard(schoolName: string) {
    const { data: lbData } = await supabase
      .from("profiles")
      .select("username, completed_tasks_count")
      .eq("school", schoolName)
      .order("completed_tasks_count", { ascending: false })
      .limit(5);

    if (lbData) setLeaderboard(lbData);
  }

  async function fetchTasks(currentUserId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  }

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim() || !userId) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTaskTitle.trim(),
          is_completed: false,
          user_id: userId,
        },
      ])
      .select();

    if (!error && data) {
      setTasks((prev) => [data[0], ...prev]);
      setNewTaskTitle("");
    } else if (error) {
      alert("Failed to add task: " + error.message);
      console.error(error);
    }
  }

  async function toggleTask(taskId: string, isCompleted: boolean) {
    const newIsCompleted = !isCompleted;
    const { error, data } = await supabase
      .from("tasks")
      .update({ is_completed: newIsCompleted })
      .eq("id", taskId)
      .select();

    if (!error && data) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data[0] : task)),
      );

      if (profile && userId) {
        let newStreak = profile.streak || 0;
        let newLastCompleted = profile.last_task_completed_at || null;
        let newCompletedCount = profile.completed_tasks_count || 0;

        if (newIsCompleted) {
          newCompletedCount += 1;
          const todayStr = new Date().toISOString().split("T")[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (profile.last_task_completed_at === todayStr) {
            // same day
          } else if (profile.last_task_completed_at === yesterdayStr) {
            newStreak += 1;
            newLastCompleted = todayStr;
          } else {
            newStreak = 1;
            newLastCompleted = todayStr;
          }
        } else {
          newCompletedCount = Math.max(0, newCompletedCount - 1);
        }

        const updatePayload: Record<string, unknown> = {
          completed_tasks_count: newCompletedCount,
        };

        if (
          newIsCompleted &&
          newLastCompleted !== profile.last_task_completed_at
        ) {
          updatePayload.streak = newStreak;
          updatePayload.last_task_completed_at = newLastCompleted;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", userId);

        if (!profileError) {
          const updatedProfile = { ...profile, ...updatePayload };
          setProfile(updatedProfile as Profile);

          if ((updatedProfile as Profile).school) {
            fetchLeaderboard((updatedProfile as Profile).school!);
          }
        }
      }
    }
  }

  async function removeTask(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (!error) {
      const deletedTask = tasks.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      if (deletedTask?.is_completed && profile && userId) {
        const newCompletedCount = Math.max(
          0,
          (profile.completed_tasks_count || 0) - 1,
        );
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ completed_tasks_count: newCompletedCount })
          .eq("id", userId);

        if (!profileError) {
          const updatedProfile = {
            ...profile,
            completed_tasks_count: newCompletedCount,
          };
          setProfile(updatedProfile);
          if (updatedProfile.school) fetchLeaderboard(updatedProfile.school);
        }
      }
    } else {
      alert("Failed to remove task: " + error.message);
      console.error(error);
    }
  }

  async function generateAITasks(e: React.FormEvent) {
    e.preventDefault();
    if (!aiTopic.trim() || !userId) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });

      const data = await res.json();
      if (data.tasks && data.tasks.length > 0) {
        const tasksToInsert = data.tasks.map((t: { title: string }) => ({
          title: t.title,
          is_completed: false,
          user_id: userId,
        }));

        const { data: insertedTasks, error } = await supabase
          .from("tasks")
          .insert(tasksToInsert)
          .select();

        if (!error && insertedTasks) {
          setTasks((prev) => [...insertedTasks, ...prev]);
          setAiTopic("");
        } else if (error) {
          alert("Failed to generate AI tasks: " + error.message);
          console.error(error);
        }
      } else if (data.error) {
        alert("AI API Error: " + data.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + message);
      console.error("Failed to generate AI tasks", err);
    } finally {
      setIsGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/25 border-t-cyan-300"
            aria-hidden
          />
          <p className="text-sm text-[color:var(--si-text-muted)]">
            Loading workspace…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-shell min-h-screen px-4 py-8 pb-24 sm:px-6 md:px-8 md:py-10">
      <div className="container">
        <header className="dashboard-hero mb-8 rounded-3xl border border-white/10">
          <div>
            <p className="dashboard-kicker">StudyIntel</p>
            <div className="flex flex-wrap items-end gap-3">
              <h1 className="dashboard-title !max-w-none">Dashboard</h1>
              {profile?.streak !== undefined && profile.streak > 0 && (
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-orange-400/35 bg-orange-500/15 px-3 py-1 text-sm font-bold text-orange-100">
                  <span aria-hidden>🔥</span>
                  {profile.streak} day streak
                </span>
              )}
            </div>
            <p className="dashboard-subtitle">
              Signed in as{" "}
              <span className="break-all font-medium text-white/90">
                {user?.email}
              </span>
              {profile?.username ? (
                <>
                  {" "}
                  · <span className="text-white/80">{profile.username}</span>
                </>
              ) : null}
              {profile?.school ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-cyan-200/80">{profile.school}</span>
                </>
              ) : null}
            </p>
            <div className="dashboard-hero-actions">
              <Link
                href="/"
                className="btn btn-dark px-5 py-2.5 text-sm font-semibold !text-white"
              >
                Home
              </Link>
              <form onSubmit={handleLogout}>
                <button
                  type="submit"
                  className="btn btn-secondary px-5 py-2.5 text-sm font-semibold"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>

          <div className="dashboard-hero-stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Streak</span>
              <span className="dashboard-stat-value">
                {profile?.streak ?? 0}
              </span>
              <span className="dashboard-stat-status text-sm text-[color:var(--si-text-muted)]">
                Consecutive study days
              </span>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Open tasks</span>
              <span className="dashboard-stat-value">{openTasks}</span>
              <span className="dashboard-stat-status text-sm text-[color:var(--si-text-muted)]">
                Still on your plate
              </span>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Completed</span>
              <span className="dashboard-stat-value">
                {profile?.completed_tasks_count ?? 0}
              </span>
              <span className="dashboard-stat-status text-sm text-[color:var(--si-text-muted)]">
                Total finished (all time)
              </span>
            </div>
          </div>
        </header>

        <section
          className={`${panelClass()} mb-8 border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.12] via-transparent to-fuchsia-500/[0.08]`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="dashboard-section-kicker">AI</p>
              <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                Task planner
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[color:var(--si-text-muted)]">
                Describe a topic—get a batch of concrete tasks you can run
                today.
              </p>
            </div>
          </div>
          <form
            onSubmit={generateAITasks}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, React hooks, World War II…"
              disabled={isGenerating}
              className="form-control min-h-[48px] flex-1 sm:min-w-0"
            />
            <button
              type="submit"
              disabled={!aiTopic.trim() || isGenerating}
              className="btn btn-primary shrink-0 px-6 py-3 text-sm font-semibold disabled:opacity-50 sm:min-w-[148px]"
            >
              {isGenerating ? "Generating…" : "Generate plan"}
            </button>
          </form>
        </section>

        <div className="flex flex-col gap-8 lg:flex-row">
          <section className={`${panelClass()} flex-1`}>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="dashboard-section-kicker">Tasks</p>
                <h2 className="dashboard-section-title font-display text-xl text-white sm:text-2xl">
                  Your queue
                </h2>
              </div>
            </div>

            <form onSubmit={addTask} className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="form-control min-h-[48px] flex-1"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="btn btn-primary shrink-0 px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                Add
              </button>
            </form>

            <ul className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <p className="dashboard-empty-state">
                  No tasks yet. Add one above or use the AI planner.
                </p>
              ) : (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className="material-row container-row flex-wrap rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-cyan-400/25 hover:bg-white/[0.06]"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTask(task.id, task.is_completed)}
                      className="h-5 w-5 cursor-pointer rounded border-white/20 bg-white/10 accent-cyan-400"
                    />
                    <span
                      className={`material-name min-w-0 flex-1 ${
                        task.is_completed
                          ? "text-[color:var(--si-text-soft)] line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="btn btn-danger btn-sm px-3 py-2 text-xs font-semibold"
                      title="Remove task"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className={`${panelClass()} h-fit w-full lg:max-w-md`}>
            <p className="dashboard-section-kicker">Leaderboard</p>
            <h2 className="dashboard-section-title font-display text-xl text-white sm:text-2xl">
              Top students
            </h2>
            {profile?.school ? (
              <ul className="leaderboard-list mt-6">
                {leaderboard.map((lbUser, i) => (
                  <li
                    key={`${lbUser.username}-${i}`}
                    className={`leaderboard-card ${
                      i === 0
                        ? "leaderboard-card-gold"
                        : i === 1
                          ? "leaderboard-card-silver"
                          : i === 2
                            ? "leaderboard-card-bronze"
                            : ""
                    }`}
                  >
                    <span className="leaderboard-rank">{i + 1}</span>
                    <span className="leaderboard-name">
                      {lbUser.username || "Anonymous"}
                      {lbUser.username === profile.username ? " (you)" : ""}
                    </span>
                    <div className="text-right">
                      <span className="leaderboard-minutes">
                        {lbUser.completed_tasks_count || 0}
                      </span>
                      <span className="leaderboard-minutes-label">done</span>
                    </div>
                  </li>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-[color:var(--si-text-muted)]">
                    No one from your school is on the board yet. Complete a task
                    to appear.
                  </p>
                )}
              </ul>
            ) : (
              <div className="dashboard-empty-state mt-6">
                Add a school on your profile to join the cohort leaderboard.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
