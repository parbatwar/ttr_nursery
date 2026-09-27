import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { register } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F1E8]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <section className="relative hidden lg:flex lg:flex-col lg:justify-between lg:px-20 lg:py-14">
          <Link to="/" className="w-fit">
            <img
              src="/logo.png"
              alt="TTR Nursery"
              className="h-24 w-auto"
            />
          </Link>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D8672]">
              Join TTR Nursery
            </p>

            <h1 className="font-serif text-[68px] leading-none tracking-[-0.03em] text-[#243329]">
              Grow your
              <br />
              collection.
            </h1>

            <p className="mt-7 max-w-md pt-4 text-[15px] leading-7 text-[#657067]">
              Create your account in less than a minute and start shopping our
              collection of plants and flowers.
            </p>
          </div>

          <div className="border-t border-[#243329]/10 pt-6">
            <p className="font-serif text-xl text-[#243329]">
              One account.
            </p>

            <p className="mt-1 text-sm text-[#7C837D]">
              Cart, orders and checkout.
            </p>
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

        {/* RIGHT */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[480px]">
            <Link to="/" className="mb-10 flex justify-center lg:hidden">
              <img
                src="/logo.png"
                alt="TTR Nursery"
                className="h-14 w-auto"
              />
            </Link>

            <div className="rounded-[28px] border border-[#243329]/10 bg-white p-8 shadow-[0_30px_90px_rgba(38,54,43,0.08)] sm:p-10">
              <div className="mb-8">
                <h2 className="font-serif text-[44px] leading-tight text-[#243329]">
                  Create account
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#7A817B]">
                  Just your email and a password to get started.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-semibold text-[#38463C]"
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
                    className="w-full rounded-xl border border-[#D9DDD8] bg-[#FBFCFA] px-4 py-3.5 text-sm text-[#243329] outline-none transition placeholder:text-[#A5AAA6] focus:border-[#5A755F] focus:ring-4 focus:ring-[#5A755F]/10"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-semibold text-[#38463C]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-[#D9DDD8] bg-[#FBFCFA] px-4 py-3.5 pr-12 text-sm text-[#243329] outline-none transition placeholder:text-[#A5AAA6] focus:border-[#5A755F] focus:ring-4 focus:ring-[#5A755F]/10"
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

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[11px] font-semibold text-[#38463C]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-[#D9DDD8] bg-[#FBFCFA] px-4 py-3.5 pr-12 text-sm text-[#243329] outline-none transition placeholder:text-[#A5AAA6] focus:border-[#5A755F] focus:ring-4 focus:ring-[#5A755F]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#89918B] transition hover:text-[#344D3A]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
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

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#344D3A] py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#263D2C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 border-t border-[#E9ECE8] pt-7 text-center">
                <p className="text-sm text-[#7A817B]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[#47634D] underline underline-offset-4 transition hover:text-[#263D2C]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}