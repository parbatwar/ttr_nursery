import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--ttr-border-soft)] bg-[var(--ttr-bg)]">
      <div className="mx-auto flex h-20 max-w-[var(--ttr-container)] items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* Logo */}
        <Link to="/" className="flex items-center">
            <img
                src="/logo.png"
                alt="TTR Banglamukhi Nursery"
                className="h-14 w-auto"
            />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/products" className="ttr-nav-link">
            Plants
          </Link>

          <a href="/#collection" className="ttr-nav-link">
            Collection
          </a>

          <a href="/#story" className="ttr-nav-link">
            Our Story
          </a>
        </nav>

        {/* Account / Cart */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="ttr-nav-link hidden sm:block"
          >
            Account
          </Link>

          <Link to="/cart" className="ttr-nav-link">
            Cart
          </Link>
        </div>

      </div>
    </header>
  );
}