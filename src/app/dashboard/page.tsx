"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  // AI Task Planner State
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
      .select("username, role, streak, last_task_completed_at, school, completed_tasks_count")
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
        // Streak broken
        currentStreak = 0;
        await supabase
          .from("profiles")
          .update({ streak: 0 })
          .eq("id", currentUserId);
      }

      setProfile({ ...data, streak: currentStreak });

      // Fetch leaderboard
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
        prevTasks.map((task) => (task.id === taskId ? data[0] : task))
      );

      // Streak & Leaderboard logic
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
            // Already incremented streak today
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

        const updatePayload: any = {
          completed_tasks_count: newCompletedCount,
        };

        if (newIsCompleted && newLastCompleted !== profile.last_task_completed_at) {
          updatePayload.streak = newStreak;
          updatePayload.last_task_completed_at = newLastCompleted;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", userId);

        if (!profileError) {
          const updatedProfile = { ...profile, ...updatePayload };
          setProfile(updatedProfile);

          if (updatedProfile.school) {
            fetchLeaderboard(updatedProfile.school);
          }
        }
      }
    }
  }

  async function removeTask(taskId: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (!error) {
      const deletedTask = tasks.find(t => t.id === taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Decrease top student points if deleting a completed task
      if (deletedTask?.is_completed && profile && userId) {
        const newCompletedCount = Math.max(0, (profile.completed_tasks_count || 0) - 1);
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ completed_tasks_count: newCompletedCount })
          .eq("id", userId);

        if (!profileError) {
          const updatedProfile = { ...profile, completed_tasks_count: newCompletedCount };
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
        const tasksToInsert = data.tasks.map((t: any) => ({
          title: t.title,
          is_completed: false,
          user_id: userId,
        }));

        const { data: insertedTasks, error } = await supabase
          .from("tasks")
          .insert(tasksToInsert)
          .select();

        if (!error && insertedTasks) {
          // Add AI tasks to the top of the list
          setTasks((prev) => [...insertedTasks, ...prev]);
          setAiTopic("");
        } else if (error) {
          alert("Failed to generate AI tasks: " + error.message);
          console.error(error);
        }
      } else if (data.error) {
        alert("AI API Error: " + data.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
      console.error("Failed to generate AI tasks", error);
    } finally {
      setIsGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-10">
        <p className="text-black">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10 text-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 rounded bg-white p-6 shadow-md sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">StudyIntel</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-semibold tracking-tight text-black">
              Dashboard
              {profile?.streak !== undefined && profile.streak > 0 && (
                <span className="flex items-center gap-1 rounded bg-orange-100 px-2 py-1 text-sm font-bold text-orange-600">
                  🔥 {profile.streak} Day Tracker
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="text-right">
                <p className="text-sm font-semibold text-black">
                  {profile.username || "User"}
                </p>
                <p className="text-xs capitalize text-gray-500">
                  {profile.school ? `${profile.school} • ` : ""}
                  {profile.role || "student"}
                </p>
              </div>
            )}
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-50"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="rounded bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Signed in as</p>
          <p className="mt-2 break-all text-xl font-semibold text-black">
            {user?.email}
          </p>
        </section>

        {/* AI PLANNER SECTION */}
        <section className="rounded bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md border border-blue-100">
          <h2 className="mb-2 text-xl font-semibold text-blue-900">✨ AI Task Planner</h2>
          <p className="mb-4 text-sm text-blue-700">Not sure where to start? Tell AI what you want to study!</p>
          <form onSubmit={generateAITasks} className="flex gap-2">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, React Hooks, World War 2..."
              disabled={isGenerating}
              className="flex-1 rounded border border-blue-200 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!aiTopic.trim() || isGenerating}
              className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center min-w-[140px]"
            >
              {isGenerating ? "Generating..." : "Generate Plan"}
            </button>
          </form>
        </section>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* TASK TRACKER SECTION */}
          <section className="flex-1 rounded bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-black">Tasks</h2>

            <form onSubmit={addTask} className="mb-6 flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 rounded border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              >
                Add
              </button>
            </form>

            <ul className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet. Add one above or use the AI Planner!</p>
              ) : (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTask(task.id, task.is_completed)}
                      className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`flex-1 ${
                        task.is_completed
                          ? "text-gray-400 line-through"
                          : "text-black"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="rounded bg-red-50 border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700"
                      title="Remove task"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* LEADERBOARD SECTION */}
          <section className="h-fit w-full rounded bg-white p-6 shadow-md md:w-1/3">
            <h2 className="mb-6 text-2xl font-semibold text-black">🏆 Top Students</h2>
            {profile?.school ? (
              <ul className="flex flex-col gap-3">
                {leaderboard.map((lbUser, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-3"
                  >
                    <span className="font-medium text-black">
                      {i + 1}. {lbUser.username || "Anonymous"}
                      {lbUser.username === profile.username && " (You)"}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {lbUser.completed_tasks_count || 0}
                    </span>
                  </li>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No one from your school is on the leaderboard yet!
                  </p>
                )}
              </ul>
            ) : (
              <div className="rounded border border-dashed border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-500">
                  Want to compete? Add a school to your profile to join the leaderboard!
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
