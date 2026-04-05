// src/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Only reference favicon.ico for now — add others when you have the files */}
        <link rel="icon" href="/favicon.ico" />

        {/* ✅ Remove these until files exist in /public
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        */}

        <link rel="manifest" href="/site.webmanifest" />
        <meta name="author"      content="CoinScope Pro" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <body className="bg-slate-50 dark:bg-slate-950 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}