// src/components/Navbar.jsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme }       = useTheme();
  const [mounted, setMounted]     = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => setMounted(true), []);

  const isLoading = status === "loading";

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-slate-900 dark:text-white tracking-tight shrink-0"
          >
            CoinScope <span className="text-blue-500">Pro</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Markets
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              About
            </Link>

            {/* ✅ Portfolio — always visible, redirects to signin if not logged in */}
            <Link
              href="/portfolio"
              className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Portfolio
            </Link>

            {/* Profile — only when logged in */}
            {session && (
              <Link
                href="/profile"
                className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Profile
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {/* Auth */}
            {isLoading ? (
              <div className="h-9 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2">
                {/* Avatar — links to profile */}
                <Link href="/profile">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 py-3 space-y-1">
            {[
              { href: "/",          label: "Markets"   },
              { href: "/about",     label: "About"     },
              { href: "/portfolio", label: "Portfolio" },
              ...(session ? [{ href: "/profile",   label: "Profile"   }] : []),
              ...(session ? [{ href: "/settings",  label: "Settings"  }] : []),
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {label}
              </Link>
            ))}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}