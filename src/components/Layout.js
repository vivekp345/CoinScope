import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'CoinScope | Real-Time Crypto Insights' }) {
  const router = useRouter();

  // Helper to highlight active link
  const isActive = (path) => {
    return router.pathname === path 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Head>
        <title>{title}</title>
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* 1. LEFT: Logo */}
     {/* LEFT: Financial Brand Identity */}
<div className="flex-shrink-0 flex items-center z-10">
  <Link href="/" className="flex items-center gap-3 group">
    <div className="bg-blue-600 p-2 rounded-lg shadow-md group-hover:bg-blue-700 transition-all">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11z" />
        <path d="M8 12l3-3 2 2 3-3" />
      </svg>
    </div>
    <span className="text-2xl font-black text-slate-900 tracking-tight">
      CoinScope
    </span>
  </Link>
</div>    
            {/* 2. RIGHT: Home & About Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${isActive('/')}`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${isActive('/about')}`}
              >
                About
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CoinScope. Built with Next.js and Server-Side Rendering.</p>
        </div>
      </footer>
    </div>
  );
}