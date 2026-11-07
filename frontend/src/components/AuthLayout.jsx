import { Link } from "react-router-dom";

// The shared two-column layout for the sign in and sign up pages.
export default function AuthLayout({ title, intro, headline, children, footer }) {
  return (
    <main className="grid min-h-screen bg-[var(--ttr-bg)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src="/images/hero-leaves.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0a160e]/45" />

        <div className="relative flex h-full flex-col justify-end p-12 text-white xl:p-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em]">
            TTR Banglamukhi Nursery
          </p>
          <h2 className="max-w-lg text-[72px] leading-none">{headline}</h2>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-5 lg:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="TTR Banglamukhi Nursery home">
            <img src="/logo-clean.png" alt="" className="h-[60px] w-auto" />
          </Link>

          <Link
            to="/products"
            className="inline-flex min-h-11 items-center font-semibold text-[var(--ttr-green)]"
          >
            Continue shopping ›
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <h1 className="text-[56px] leading-none">{title}</h1>
          <p className="mb-8 mt-3 text-[var(--ttr-text-soft)]">{intro}</p>

          {children}

          <div className="mt-7 border-t border-[var(--ttr-border)] pt-6 text-center text-[15px] text-[var(--ttr-text-soft)]">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
