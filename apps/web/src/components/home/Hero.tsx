import React from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// Hero component - Landing page hero section
export default function Hero(): React.JSX.Element {
  return (
    <section className="section relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 via-dark-950 to-dark-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float animation-delay-400" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Testnet 100% Deployed • 9/9 Services Live
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 animate-fade-in-up animation-delay-200">
            High-Performance
            <br />
            <span className="gradient-text">Layer-1 Blockchain</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-dark-300 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-400 leading-relaxed">
            axionax is powered by{' '}
            <span className="text-primary-400 font-semibold">
              Proof of Probabilistic Checking
            </span>{' '}
            (PoPC) consensus, enabling{' '}
            <span className="text-secondary-400 font-medium">
              decentralized computing
            </span>{' '}
            and{' '}
            <span className="text-secondary-400 font-medium">AI workloads</span>{' '}
            with unprecedented efficiency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-600">
            <Button variant="primary" size="lg" className="text-lg">
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Arrow right icon"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="text-lg">
                Read Documentation
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Documentation icon"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-800">
            <div className="group text-center p-4 rounded-xl bg-dark-900/50 border border-dark-800 hover:border-primary-500/50 hover:bg-dark-900 transition-all duration-300 cursor-default">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                86137
              </div>
              <div className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                Testnet Chain ID
              </div>
            </div>
            <div className="group text-center p-4 rounded-xl bg-dark-900/50 border border-dark-800 hover:border-secondary-500/50 hover:bg-dark-900 transition-all duration-300 cursor-default">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                9/9
              </div>
              <div className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                Services Live
              </div>
            </div>
            <div className="group text-center p-4 rounded-xl bg-dark-900/50 border border-dark-800 hover:border-primary-500/50 hover:bg-dark-900 transition-all duration-300 cursor-default">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                2d+
              </div>
              <div className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                Uptime
              </div>
            </div>
            <div className="group text-center p-4 rounded-xl bg-dark-900/50 border border-dark-800 hover:border-secondary-500/50 hover:bg-dark-900 transition-all duration-300 cursor-default">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                Deployed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
