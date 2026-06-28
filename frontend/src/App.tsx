import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import PomodoroTimer from "./components/Timer";
import TodoList from "./components/TodoList";
import Quote from "./components/Quote";
import AmbientPlayer from "./components/AmbientPlayer";
import api from "./services/api";
import {
  LogOut,
  Target,
  CalendarDays,
  Clock3,
  Sparkles,
  CheckCircle2,
  ListTodo,
  Timer,
} from "lucide-react";

interface User {
  id: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  /* ---------------- Dashboard Header ---------------- */

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [today, setToday] = useState("");

  /* ---------------- Dashboard Stats ---------------- */

  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [focusMode, setFocusMode] = useState("Pomodoro");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now.getHours();

      if (hour < 12) {
        setGreeting("Good Morning ☀️");
      } else if (hour < 17) {
        setGreeting("Good Afternoon 🌤️");
      } else {
        setGreeting("Good Evening 🌙");
      }

      setToday(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 rounded-b-[40px] shadow-2xl">
        {/* Background Decorations */}

        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Left Side */}

            <div className="flex items-start gap-5">

  {/* Logo */}

  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-lg flex-shrink-0">

    <Target
      size={42}
      className="text-white"
    />

  </div>

  {/* Text Section */}

  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Sparkles
        size={18}
        className="text-yellow-300"
      />
      <span className="uppercase tracking-[3px] text-sm font-semibold text-blue-100">
        Productivity Dashboard
      </span>
    </div>
    <h1 className="text-5xl font-extrabold text-white leading-tight">
      Focus Flow
    </h1>
    <p className="text-blue-100 text-xl">
      {greeting},
      <span className="font-bold text-white">
        {" "}
        {user.email
  .split("@")[0]
  .replace(/[._-]/g, " ")
  .split(" ")
  .map(
    word =>
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
  )
  .join(" ")}
      </span>
      👋
    </p>
    <p className="text-blue-200">
      Stay consistent. Small progress every day.
    </p>
    <div className="flex flex-wrap gap-6 pt-2 text-blue-100">
      <div className="flex items-center gap-2">
        <CalendarDays size={18} />
        <span>
          {today}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock3 size={18} />
        <span>
          {currentTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  </div>
</div>

            {/* Right Side */}

            <div className="flex flex-col items-end gap-4">
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-4 text-right">
                <p className="text-blue-100 text-sm"> Logged in as </p>
                <h3 className="text-white font-semibold"> {user.email} </h3>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                {" "}
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ================= Dashboard Cards ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* Total Tasks */}

          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Tasks</p>

                <h2 className="text-4xl font-bold mt-2 text-gray-800">
                  {dashboardStats.total}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <ListTodo size={30} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>

                <h2 className="text-4xl font-bold mt-2 text-yellow-600">
                  {dashboardStats.pending}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <Clock3 size={30} className="text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Completed */}

          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>

                <h2 className="text-4xl font-bold mt-2 text-green-600">
                  {dashboardStats.completed}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={30} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Focus Mode */}

          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Current Mode</p>

                <h2 className="text-2xl font-bold mt-2 text-purple-600">
                  {focusMode}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Timer size={30} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Streak */}

          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Productivity Streak</p>

                <h2 className="text-4xl font-bold mt-2 text-orange-500">
                  {streak}
                </h2>

                <p className="text-sm text-gray-500">day(s)</p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
                🔥
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN DASHBOARD ================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}

          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-white text-2xl font-bold">
                  📋 Task Management
                </h2>

                <p className="text-blue-100 mt-1">
                  Organize and complete your daily goals.
                </p>
              </div>

              <div className="p-6">
                <TodoList
                  user={user}
                  onStatsChange={setDashboardStats}
                  onStreakChange={setStreak}
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-8">
            {/* Pomodoro */}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600">
                <h2 className="text-white text-xl font-bold">⏱ Focus Timer</h2>

                <p className="text-purple-100 mt-1">
                  Stay productive using the Pomodoro technique.
                </p>
              </div>

              <div className="p-6">
                <PomodoroTimer onModeChange={setFocusMode} />
              </div>
            </div>

            {/* Ambient */}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-green-600">
                <h2 className="text-white text-xl font-bold">
                  🎵 Ambient Sounds
                </h2>

                <p className="text-green-100 mt-1">Relax and stay focused.</p>
              </div>

              <div className="p-6">
                <AmbientPlayer />
              </div>
            </div>

            {/* Inspiration */}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-yellow-500">
                <h2 className="text-white text-xl font-bold">
                  💡 Daily Inspiration
                </h2>

                <p className="text-yellow-100 mt-1">
                  Motivation for today's work.
                </p>
              </div>

              <div className="p-6">
                <Quote />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <footer className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800">Focus Flow</h2>

            <p className="text-gray-500 mt-3">
              Stay Focused • Stay Consistent • Stay Productive
            </p>

            <div className="mt-6 text-sm text-gray-400">
              Made with MERN. © 2026 Focus Flow. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
