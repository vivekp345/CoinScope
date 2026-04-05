// src/pages/_app.js
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Global SEO defaults — individual pages override these */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*
        SessionProvider makes useSession() available everywhere.
        pageProps.session is passed from getServerSideProps on each page
        to avoid a loading flash on first render.
      */}
      <SessionProvider session={pageProps.session}>
        {/*
          ThemeProvider reads from localStorage and applies
          the "dark" class to <html> — Tailwind picks it up automatically.
          attribute="class" is required for Tailwind's darkMode: "class" config.
        */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}