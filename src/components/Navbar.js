// src/components/Navbar.jsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  // Mounted guard — prevents hydration mismatch for theme-dependent UI
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoading = status === "loading";

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            CoinScope <span className="text-blue-500">Pro</span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Markets
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            {session && (
              <Link
                href="/portfolio"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Portfolio
              </Link>
            )}
          </div>

          {/* Right side — theme toggle + auth */}
          <div className="flex items-center gap-3">

            {/* Dark mode toggle — only renders after mount to avoid mismatch */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  // Sun icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                  </svg>
                ) : (
                  // Moon icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {/* Auth button */}
            {isLoading ? (
              // Skeleton to prevent layout shift while session loads
              <div className="h-9 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {/* User avatar */}
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign in
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}