import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "Services", to: "/services" },
  { name: "Contact Us", to: "/contact" },
];

const iconButton =
  "relative grid h-11 w-11 place-items-center rounded-full text-[var(--ttr-text)] transition hover:bg-[var(--ttr-bg-soft)]";

function AccountMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    }

    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Account options"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className={iconButton}
      >
        <UserRound size={21} strokeWidth={1.6} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-[var(--ttr-radius-card)] bg-white p-2 shadow-[0_18px_50px_rgba(24,35,27,0.16),0_0_0_1px_rgba(24,35,27,0.06)]">
          <p className="truncate px-3 py-2.5 text-sm text-[var(--ttr-text-muted)]">
            {user?.email || user?.username}
          </p>

          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition hover:bg-[var(--ttr-bg-soft)]"
          >
            <UserRound size={17} strokeWidth={1.6} />
            My profile
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] transition hover:bg-[var(--ttr-bg-soft)]"
          >
            <LogOut size={17} strokeWidth={1.6} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoggedIn, logoutUser } = useAuth();
  const { itemCount, openCart, clearLocalCart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [openPath, setOpenPath] = useState({ menu: null, search: null });

  // Panels only stay open on the page where they were opened.
  const isMenuOpen = openPath.menu === pathname;
  const isSearchOpen = openPath.search === pathname;

  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  function toggleMenu() {
    setOpenPath({ menu: isMenuOpen ? null : pathname, search: null });
  }

  function toggleSearch() {
    setOpenPath({ menu: null, search: isSearchOpen ? null : pathname });
  }

  function handleLogout() {
    logoutUser();
    clearLocalCart();
    navigate("/");
  }

  function handleSearch(event) {
    event.preventDefault();

    const search = new FormData(event.currentTarget).get("search").trim();

    setOpenPath({ menu: null, search: null });
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--ttr-bg)]/90 backdrop-blur-xl transition-shadow duration-300 ${
        isScrolled || isMenuOpen || isSearchOpen
          ? "shadow-[0_1px_0_rgba(24,35,27,0.1)]"
          : ""
      }`}
    >
      <div className="mx-auto grid h-[68px] w-[calc(100%-24px)] max-w-[var(--ttr-container)] grid-cols-[1fr_auto] items-center lg:h-20 lg:w-[calc(100%-64px)] lg:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          aria-label="TTR Banglamukhi Nursery home"
          className="w-fit transition-opacity hover:opacity-80"
        >
          <img src="/logo-clean.png" alt="" className="h-[54px] w-auto lg:h-[64px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-full px-4 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--ttr-bg-soft)] text-[var(--ttr-text)]"
                    : "text-[var(--ttr-text-soft)] hover:text-[var(--ttr-text)]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label={isSearchOpen ? "Close search" : "Search plants"}
            aria-expanded={isSearchOpen}
            onClick={toggleSearch}
            className={iconButton}
          >
            {isSearchOpen ? (
              <X size={21} strokeWidth={1.6} />
            ) : (
              <Search size={21} strokeWidth={1.6} />
            )}
          </button>

          <span className="hidden lg:block">
            {isLoggedIn ? (
              <AccountMenu user={user} onLogout={handleLogout} />
            ) : (
              <Link to="/login" aria-label="Sign in" className={iconButton}>
                <UserRound size={21} strokeWidth={1.6} />
              </Link>
            )}
          </span>

          <button
            type="button"
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            onClick={openCart}
            className={iconButton}
          >
            <ShoppingBag size={21} strokeWidth={1.6} />

            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-[var(--ttr-text)] px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
            className={`${iconButton} lg:hidden`}
          >
            {isMenuOpen ? (
              <X size={22} strokeWidth={1.6} />
            ) : (
              <Menu size={22} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <form
          role="search"
          onSubmit={handleSearch}
          className="border-t border-[var(--ttr-border-soft)] bg-[var(--ttr-bg)] py-4"
        >
          <div className="relative mx-auto w-[calc(100%-24px)] max-w-[720px]">
            <label htmlFor="nav-search" className="sr-only">
              Search plants
            </label>
            <input
              ref={searchInputRef}
              id="nav-search"
              name="search"
              type="search"
              placeholder="Search by plant or local name"
              className="h-[52px] w-full rounded-full bg-[var(--ttr-bg-soft)] pl-5 pr-14 text-base outline-none focus:ring-2 focus:ring-[var(--ttr-green)]/25"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1 grid h-11 w-11 place-items-center rounded-full bg-[var(--ttr-text)] text-white"
            >
              <Search size={18} strokeWidth={1.8} />
            </button>
          </div>
        </form>
      )}

      {isMenuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-[var(--ttr-border-soft)] bg-[var(--ttr-bg)] px-4 pb-5 pt-2 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex min-h-[56px] items-center justify-between border-b border-[var(--ttr-border-soft)] font-serif text-[30px]"
            >
              {link.name}
              <ChevronRight size={20} strokeWidth={1.5} />
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="mt-4 flex gap-2">
              <Link
                to="/account"
                className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--ttr-bg-soft)] font-semibold"
              >
                My profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--ttr-bg-soft)] font-semibold"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-[var(--ttr-bg-soft)] font-semibold"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
