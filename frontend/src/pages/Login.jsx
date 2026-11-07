import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const inputStyle =
  "w-full rounded-[var(--ttr-radius-control)] border border-[var(--ttr-border)] bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-[var(--ttr-green)] focus:ring-2 focus:ring-[var(--ttr-green)]/15";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

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
    <AuthLayout
      title="Welcome back"
      intro="Sign in to see your details and orders. You don't need an account to shop."
      headline={
        <>
          A greener space <em>starts here.</em>
        </>
      }
      footer={
        <>
          New to TTR Nursery?{" "}
          <Link to="/register" className="font-semibold text-[var(--ttr-green)]">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className={`${inputStyle} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1 grid h-11 w-11 place-items-center text-[var(--ttr-text-muted)]"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.7} />
              ) : (
                <Eye size={18} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-[var(--ttr-radius-control)] bg-red-50 px-4 py-3 text-[15px] text-red-800"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-[54px] w-full rounded-full bg-[var(--ttr-green)] font-semibold text-white transition hover:bg-[var(--ttr-green-dark)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
