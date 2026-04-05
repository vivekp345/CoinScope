// src/pages/auth/signin.js
import { useState } from "react";
import { signIn } from "next-auth/react";          // ✅ client hooks from /react
import { getServerSession } from "next-auth/next"; // ✅ server helper from /next
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default function SignInPage() {
  const router = useRouter();
  const { error: queryError, callbackUrl } = router.query;

  const [mode, setMode]         = useState("signin");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(queryError ?? "");
  const [loading, setLoading]   = useState(false);

  const AUTH_ERRORS = {
    CredentialsSignin: "Incorrect email or password.",
    SessionRequired:   "Please sign in to continue.",
    Default:           "Something went wrong. Please try again.",
  };

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect:  false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(AUTH_ERRORS[result.error] ?? AUTH_ERRORS.Default);
      return;
    }

    // Redirect to callbackUrl if present, else portfolio
    router.push(callbackUrl ?? "/portfolio");
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create account
    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }

    // 2. Auto sign-in after registration
    const result = await signIn("credentials", {
      redirect:  false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created. Please sign in.");
      setMode("signin");
      return;
    }

    router.push(callbackUrl ?? "/portfolio");
  }

  return (
    <>
      <Head>
        <title>{mode === "signin" ? "Sign In" : "Create Account"} — CoinScope Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white">
              CoinScope <span className="text-blue-500">Pro</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {mode === "signin" ? "Sign in to your account" : "Create a free account"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

            {/* Error banner */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={mode === "signin" ? handleSignIn : handleRegister}
              className="space-y-4"
            >
              {/* Name — register only */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vivek"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                  required
                  minLength={8}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {loading
                  ? mode === "signin" ? "Signing in..." : "Creating account..."
                  : mode === "signin" ? "Sign in"       : "Create account"}
              </button>

            </form>

            {/* ── Uncomment when adding OAuth ──────────────────────────────
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white dark:bg-slate-900 px-2">or continue with</span>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => signIn("google", { callbackUrl: "/portfolio" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Continue with Google
              </button>
              <button onClick={() => signIn("github", { callbackUrl: "/portfolio" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Continue with GitHub
              </button>
            </div>
            ──────────────────────────────────────────────────────────────── */}

          </div>

          {/* Toggle signin / register */}
          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-blue-500 hover:underline font-medium"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("signin"); setError(""); }}
                  className="text-blue-500 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </>
  );
}

// ✅ Server-side — using getServerSession from "next-auth/next" not "next-auth/react"
export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions  // ✅ must pass authOptions — this is what "next is not a function" means
  );

  // Already signed in — redirect to portfolio
  if (session) {
    return {
      redirect: { destination: "/portfolio", permanent: false },
    };
  }

  return { props: {} };
}