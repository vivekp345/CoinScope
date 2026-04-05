// src/pages/auth/error.js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// Maps NextAuth error codes to human-readable messages
const ERROR_MESSAGES = {
  Configuration: "There is a server configuration issue. Please contact support.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link has expired or has already been used.",
  OAuthSignin: "Could not start the sign-in process. Please try again.",
  OAuthCallback: "Could not complete sign-in. Please try again.",
  OAuthCreateAccount: "Could not create your account. Please try again.",
  EmailCreateAccount: "Could not create your account. Please try again.",
  Callback: "An error occurred during sign-in. Please try again.",
  Default: "An unexpected error occurred. Please try again.",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const errorCode = router.query.error ?? "Default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <>
      <Head>
        <title>Sign In Error — CoinScope Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            {/* Error icon */}
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
              </svg>
            </div>

            <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Sign in failed
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {message}
            </p>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="block w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Try again
              </Link>
              <Link
                href="/"
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// SSR — error code comes from query param, page renders on server
export async function getServerSideProps(context) {
  return {
    props: {},
  };
}