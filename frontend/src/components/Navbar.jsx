import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  ShoppingBag,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isLoading,
    isLoggedIn,
    logoutUser,
  } = useAuth();

  const [accountOpen, setAccountOpen] = useState(false);

  const dropdownRef = useRef(null);
  const accountButtonRef = useRef(null);

  function handleLogout() {
    logoutUser();

    setAccountOpen(false);

    navigate("/");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape" && dropdownRef.current?.contains(document.activeElement)) {
        setAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ttr-border-soft)] bg-[var(--ttr-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[var(--ttr-container)] items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-opacity duration-300 hover:opacity-80"
        >
          <img
            src="/logo.png"
            alt="TTR Banglamukhi Nursery"
            className="h-14 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/products"
            className="ttr-nav-link group relative"
          >
            Plants

            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[var(--ttr-green)] transition-all duration-300 group-hover:w-full" />
          </Link>

          <a
            href="/#collection"
            className="ttr-nav-link group relative"
          >
            Collection

            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[var(--ttr-green)] transition-all duration-300 group-hover:w-full" />
          </a>

          <a
            href="/#story"
            className="ttr-nav-link group relative"
          >
            Our Story

            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[var(--ttr-green)] transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* ACCOUNT */}
          {isLoading ? (
            <span role="status" className="px-3 text-sm text-[var(--ttr-text-muted)]">Loading account…</span>
          ) : isLoggedIn ? (
            <div
              ref={dropdownRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false);
              }}
            >
              <button
                ref={accountButtonRef}
                type="button"
                aria-label="Account options"
                aria-expanded={accountOpen}
                aria-controls="account-dropdown"
                onClick={() =>
                  setAccountOpen((prev) => !prev)
                }
                className="group flex h-10 items-center gap-2 rounded-full px-3 text-[var(--ttr-text-soft)] transition-all duration-300 hover:bg-[var(--ttr-bg-soft)] hover:text-[var(--ttr-green-dark)]"
              >
                <UserRound
                  size={20}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />

                <span className="hidden max-w-32 truncate text-sm sm:inline">
                  {user?.name || user?.username || "Account"}
                </span>

                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={`hidden transition-transform duration-300 sm:block ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {accountOpen && (
                <div id="account-dropdown" className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-[#243329]/10 bg-white shadow-[0_20px_60px_rgba(36,51,41,0.14)]">

                  {/* User info */}
                  <div className="border-b border-[#243329]/10 px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#89918B]">
                      Signed in as
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[#243329]">
                      {user?.name ||
                        user?.username ||
                        user?.email ||
                        "Account"}
                    </p>

                    {user?.email && (
                      <p className="mt-0.5 truncate text-xs text-[#89918B]">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Menu */}
                  <div className="p-2">

                    <Link
                      to="/account"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#48534B] transition hover:bg-[#F4F6F2] hover:text-[#243329]"
                    >
                      <UserRound
                        size={17}
                        strokeWidth={1.5}
                      />

                      My profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#48534B] transition hover:bg-[#F4F6F2] hover:text-[#243329]"
                    >
                      <LogOut
                        size={17}
                        strokeWidth={1.5}
                      />

                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Sign in"
              className="group flex h-10 items-center gap-2 rounded-full px-3 text-[var(--ttr-text-soft)] transition-all duration-300 hover:bg-[var(--ttr-bg-soft)] hover:text-[var(--ttr-green-dark)]"
            >
              <UserRound
                size={20}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />

              <span className="hidden text-sm sm:inline">
                Sign In
              </span>
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="group flex h-10 w-10 items-center justify-center rounded-full text-[var(--ttr-text-soft)] transition-all duration-300 hover:bg-[var(--ttr-bg-soft)] hover:text-[var(--ttr-green-dark)]"
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>

        </div>
      </div>
    </header>
  );
}
