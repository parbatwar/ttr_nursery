import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { register } from "../services/auth";

const inputStyle =
  "w-full rounded-[var(--ttr-radius-control)] border border-[var(--ttr-border)] bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-[var(--ttr-green)] focus:ring-2 focus:ring-[var(--ttr-green)]/15";

function PasswordField({ id, label, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          required
          className={`${inputStyle} pr-12`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-1 top-1 grid h-11 w-11 place-items-center text-[var(--ttr-text-muted)]"
        >
          {isVisible ? (
            <EyeOff size={18} strokeWidth={1.7} />
          ) : (
            <Eye size={18} strokeWidth={1.7} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({ email, password });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      intro="Just your email and a password. You can also shop without an account."
      headline={
        <>
          Grow your <em>collection.</em>
        </>
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--ttr-green)]">
            Sign in
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

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
