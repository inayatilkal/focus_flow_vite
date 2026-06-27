import { useState } from "react";
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

interface User {
  id: string;
  email: string;
}

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  /* ---------------- AUTH ---------------- */

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- UI ---------------- */

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await api.post("/auth/register", {
          email,
          password,
        });
        setIsSignUp(false);
        setPassword("");
        alert("🎉 Registration successful!\nPlease sign in.");
      } else {
        const response = await api.post("/auth/login", {
          email,
          password,
        });
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
        } else {
          sessionStorage.setItem("token", response.data.token);
        }
        onAuthSuccess(response.data.user);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const switchMode = () => {
    clearForm();
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-500 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-300/10 rounded-full blur-3xl"></div>

        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* ================= LEFT PANEL ================= */}

          <div className="hidden lg:block text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
                <Target size={42} />
              </div>

              <div>
                <p className="uppercase tracking-[4px] text-cyan-200 text-sm font-semibold">
                  Productivity Suite
                </p>

                <h1 className="text-6xl font-black mt-2">Focus Flow</h1>
              </div>
            </div>

            <p className="mt-8 text-2xl leading-relaxed text-blue-100">
              Plan smarter. Focus deeper. Achieve more every single day.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-300" />

                <div>
                  <h3 className="font-semibold text-xl">Smart Task Manager</h3>

                  <p className="text-blue-100">Organize tasks effortlessly.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-300" />

                <div>
                  <h3 className="font-semibold text-xl">Pomodoro Timer</h3>

                  <p className="text-blue-100">
                    Stay focused using proven techniques.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-300" />

                <div>
                  <h3 className="font-semibold text-xl">Ambient Sounds</h3>

                  <p className="text-blue-100">
                    Relax while boosting concentration.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-300" />

                <div>
                  <h3 className="font-semibold text-xl">Daily Inspiration</h3>

                  <p className="text-blue-100">Begin every day motivated.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-8">
              <div>
                <h2 className="text-5xl font-bold">10K+</h2>

                <p className="text-blue-100">Tasks Managed</p>
              </div>

              <div>
                <h2 className="text-5xl font-bold">25 min</h2>

                <p className="text-blue-100">Focus Sessions</p>
              </div>

              <div>
                <h2 className="text-5xl font-bold">100%</h2>

                <p className="text-blue-100">Free</p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="bg-white/15 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl p-10">
            {/* ================= LOGIN HEADER ================= */}

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-xl mb-6">
                {isSignUp ? (
                  <UserPlus size={38} className="text-white" />
                ) : (
                  <LogIn size={38} className="text-white" />
                )}
              </div>

              <div className="flex justify-center items-center gap-2 mb-3">
                <Sparkles className="text-yellow-400" size={20} />

                <span className="uppercase tracking-[4px] text-sm font-semibold text-blue-600">
                  Welcome
                </span>
              </div>

              <h2 className="text-4xl font-black text-white">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>

              <p className="text-blue-100 mt-4 leading-relaxed">
                {isSignUp
                  ? "Create your Focus Flow account and begin your productivity journey."
                  : "Sign in and continue building your productivity streak."}
              </p>
            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mt-8 rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    ❌
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-700">
                      Authentication Error
                    </h4>

                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* ================= EMAIL ================= */}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white/90
                    pl-12
                    pr-4
                    py-4
                    text-gray-900
                    shadow-sm
                    transition-all
                    duration-300
                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-100
                    outline-none
                    "
                  />
                </div>
              </div>

              {/* ================= PASSWORD ================= */}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter your password"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white/90
                      pl-12
                      pr-14
                      py-4
                      text-gray-900
                      shadow-sm
                      transition-all
                      duration-300
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-100
                      outline-none
                      "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-indigo-600
                    transition-colors
                    "
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* ================= REMEMBER ================= */}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="
                        h-5
                        w-5
                        rounded
                        border-gray-300
                        text-indigo-600
                        focus:ring-indigo-500
                        "
                  />

                  <span className="text-blue-100">Remember Me</span>
                </label>
              </div>

              {/* ================= SUBMIT BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                    group
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    via-blue-600
                    to-cyan-500
                    py-4
                    text-white
                    font-semibold
                    text-lg
                    shadow-xl
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                    hover:shadow-2xl
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    "
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      {isSignUp ? <UserPlus size={22} /> : <LogIn size={22} />}

                      <span>{isSignUp ? "Create Account" : "Sign In"}</span>

                      <ArrowRight
                        size={20}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* ================= DIVIDER ================= */}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-transparent px-4 text-sm text-blue-100">
                  OR
                </span>
              </div>
            </div>

            {/* ================= SWITCH MODE ================= */}

            <div className="text-center">
              <p className="text-blue-100">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>

              <button
                type="button"
                onClick={switchMode}
                className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-indigo-200
                bg-indigo-50
                px-6
                py-3
                text-indigo-700
                font-semibold
                transition-all
                duration-300
                hover:bg-indigo-100
                hover:scale-105
                "
              >
                {isSignUp ? <LogIn size={20} /> : <UserPlus size={20} />}

                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </div>

            {/* ================= FOOTER ================= */}

            <div className="mt-10 text-center">
              <p className="text-blue-100 text-sm">© 2026 Focus Flow</p>

              <p className="text-cyan-200 text-xs mt-2">
                Stay Focused • Stay Productive • Stay Consistent
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
