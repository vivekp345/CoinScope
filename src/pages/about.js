import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About CoinScope | Our Mission">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <a href="/" className="text-slate-400 hover:text-blue-600 text-sm font-medium transition-colors">
            &larr; Back to Home
          </a>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            About CoinScope
          </h1>
          
          <div className="prose prose-slate prose-lg text-slate-500 leading-relaxed">
            <p className="mb-8">
              CoinScope is a premier cryptocurrency analytics platform designed to empower
              investors with real-time market insights. Leveraging advanced server-side
              rendering technology and optimized data pipelines, we deliver split-second price
              updates and comprehensive trend analysis to help you make informed decisions
              in the fast-paced world of digital assets.
            </p>

            <hr className="my-8 border-slate-100" />

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p>
              We believe that financial data should be accessible, transparent, and easy to
              understand for everyone. Our mission is to demystify the complexities of the
              crypto market by providing a clean, professional interface that strips away the
              noise and focuses on the metrics that matter most.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}