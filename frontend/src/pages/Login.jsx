import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginUser(email, password);

      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F1E8]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-12 xl:px-24 xl:py-16">

          <Link to="/" className="relative z-10 inline-flex w-fit">
            <img
              src="/logo.png"
              alt="TTR Banglamukhi Nursery"
              className="h-24 w-auto object-contain"
            />
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D8672]">
              Plant a little personality
            </p>

            <h2 className="font-serif text-[64px] leading-[1.02] tracking-[-0.03em] text-[#243329] xl:text-[72px]">
              A greener space starts here.
            </h2>

            <p className="mt-7 max-w-md pt-4 text-[15px] leading-7 text-[#657067]">
              Discover plants, build your collection, and bring a little more
              nature into the places you call home.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-8 border-t border-[#243329]/10 pt-7">
            <div>
              <p className="font-serif text-xl text-[#243329]">
                Thoughtfully
              </p>

              <p className="mt-1 text-xs text-[#7C837D]">
                selected plants
              </p>
            </div>

            <div className="h-9 w-px bg-[#243329]/10" />

            <div>
              <p className="font-serif text-xl text-[#243329]">
                Simply
              </p>

              <p className="mt-1 text-xs text-[#7C837D]">
                delivered to you
              </p>
            </div>
          </div>

          {/* Botanical illustration */}
          <svg
            className="pointer-events-none absolute bottom-0 right-0 h-[72%] w-[55%] text-[#7F957E]/20"
            viewBox="0 0 500 700"
            fill="none"
          >
            <path
              d="M247 700C246 588 259 491 292 397C324 306 370 223 435 142"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M300 378C349 338 393 327 433 338C409 384 366 404 300 378Z"
              fill="currentColor"
            />

            <path
              d="M336 297C369 249 407 226 452 226C444 276 407 307 336 297Z"
              fill="currentColor"
            />

            <path
              d="M273 449C228 414 186 404 148 419C172 459 213 469 273 449Z"
              fill="currentColor"
            />

            <path
              d="M318 336C280 298 241 283 201 293C216 337 254 356 318 336Z"
              fill="currentColor"
            />

            <path
              d="M378 231C349 194 340 157 350 121C390 140 401 178 378 231Z"
              fill="currentColor"
            />

            <circle
              cx="434"
              cy="140"
              r="9"
              fill="currentColor"
            />
          </svg>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">

          <div className="w-full max-w-[510px]">

            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-10 flex justify-center lg:hidden"
            >
              <img
                src="/logo.png"
                alt="TTR Banglamukhi Nursery"
                className="h-18 w-auto object-contain"
              />
            </Link>

            <div className="rounded-[28px] border border-[#243329]/10 bg-white/90 p-7 shadow-[0_30px_90px_rgba(38,54,43,0.09)] backdrop-blur-sm sm:p-10 lg:p-12">

              <div className="mb-8">
                <h1 className="font-serif text-[42px] leading-tight tracking-[-0.025em] text-[#243329] sm:text-[48px]">
                  Sign in
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-[11px] font-semibold tracking-[0.06em] text-[#38463C]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-[#D9DDD8] bg-[#FBFCFA] px-4 py-3.5 text-sm text-[#243329] outline-none transition placeholder:text-[#A5AAA6] hover:border-[#BEC8BF] focus:border-[#5A755F] focus:bg-white focus:ring-4 focus:ring-[#5A755F]/10"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-[11px] font-semibold tracking-[0.06em] text-[#38463C]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-[11px] font-medium text-[#64806A] transition hover:text-[#314C38]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-[#D9DDD8] bg-[#FBFCFA] px-4 py-3.5 pr-12 text-sm text-[#243329] outline-none transition placeholder:text-[#A5AAA6] hover:border-[#BEC8BF] focus:border-[#5A755F] focus:bg-white focus:ring-4 focus:ring-[#5A755F]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#89918B] transition hover:text-[#344D3A]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#344D3A] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#263D2C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {loading ? "Signing In..." : "Sign In"}
                  </span>

                  {!loading && (
                    <span className="absolute right-5 text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>

              {/* REGISTER */}
              <div className="mt-8 border-t border-[#E9ECE8] pt-7 text-center">
                <p className="text-sm text-[#7A817B]">
                  New to TTR Nursery?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-[#47634D] underline decoration-[#47634D]/35 underline-offset-4 transition hover:text-[#263D2C]"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* SECURITY NOTE */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#858D86]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="10"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              <span>Your account information is kept secure.</span>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
