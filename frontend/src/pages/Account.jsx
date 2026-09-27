import { Link, Navigate } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, isLoading, logoutUser } = useAuth();

  if (isLoading) return <p role="status" className="px-6 py-20 text-center">Loading your profile…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="bg-[var(--ttr-bg-soft)] px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--ttr-green)]">Your account</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">My profile</h1>
        <div className="mt-10 rounded-2xl border border-[var(--ttr-border)] bg-white p-6 sm:p-10">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-[var(--ttr-bg-soft)] p-4 text-[var(--ttr-green)]"><UserRound size={26} /></span>
            <h2 className="min-w-0 break-words font-serif text-2xl">{user.username || "Your profile"}</h2>
          </div>
          <dl className="mt-8 space-y-6 border-t border-[var(--ttr-border-soft)] pt-6">
            <div><dt className="text-xs text-[var(--ttr-text-muted)]">Username</dt><dd className="mt-2 break-words">{user.username}</dd></div>
            <div><dt className="text-xs text-[var(--ttr-text-muted)]">Email address</dt><dd className="mt-2 break-words">{user.email}</dd></div>
          </dl>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--ttr-border-soft)] pt-6">
            <Link to="/products" className="text-sm text-[var(--ttr-green)] underline underline-offset-4">Continue shopping</Link>
            <button type="button" onClick={logoutUser} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm hover:bg-[var(--ttr-bg-soft)]"><LogOut size={17} />Logout</button>
          </div>
        </div>
      </div>
    </section>
  );
}
