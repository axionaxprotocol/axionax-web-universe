import React from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// Hero component - Landing page hero section with Black Hole / Event Horizon theme
export default function Hero(): React.JSX.Element {
  return (
    <section className="section relative overflow-hidden min-h-screen flex items-center">
      {/* Stars background */}
      <div className="stars" />
      
      {/* Black Hole Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer event horizon ring */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full opacity-20"
          style={{ animation: 'spin 60s linear infinite' }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #ff6b35, #ffa500, #ff006e, #9d4edd, #00d4ff, #ff6b35)' }}
          />
        </div>
        
        {/* Middle event horizon ring */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-30"
          style={{ animation: 'spin 40s linear infinite reverse' }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 90deg, #ff006e, #ffa500, #ff6b35, #00d4ff, #9d4edd, #ff006e)' }}
          />
        </div>
        
        {/* Inner event horizon ring */}
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-40"
          style={{ animation: 'spin 20s linear infinite' }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 180deg, #00d4ff, #9d4edd, #ff006e, #ffa500, #ff6b35, #00d4ff)' }}
          />
        </div>
        
        {/* Black hole center - the singularity */}
        <div 
          className="absolute w-[150px] h-[150px] rounded-full bg-void"
          style={{ boxShadow: '0 0 100px 60px rgba(0,0,0,0.95), 0 0 150px 100px rgba(0,0,0,0.8)' }}
        />
        
        {/* Gravitational lensing effect */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-horizon-purple/20 animate-pulse" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-horizon-orange/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-space-dust/50 border border-horizon-purple/30 rounded-full text-starlight text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-horizon-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-horizon-gold"></span>
              </span>
              Testnet Phase 2 • 2 Validators • Chain ID 86137
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 animate-fade-in-up animation-delay-200">
            <span className="text-starlight">Welcome to the</span>
            <br />
            <span className="text-horizon text-glow">Event Horizon</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-starlight/70 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-400 leading-relaxed">
            <span className="text-horizon-blue font-semibold">Axionax v1.9.0</span> — powered by{' '}
            <span className="text-horizon-orange font-semibold">
              Proof of Probabilistic Checking
            </span>{' '}
            (PoPC) consensus. Where blockchain meets the cosmos with{' '}
            <span className="text-horizon-purple font-medium">
              infinite scalability
            </span>{' '}
            beyond the singularity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-600">
            <Link href="/faucet">
              <button className="btn-horizon text-lg px-8 py-4 flex items-center gap-2">
                🚀 Get Test Tokens
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
              </button>
            </Link>
            <Link href="/docs">
              <Button variant="secondary" size="lg" className="text-lg">
                📚 Read Documentation
              </Button>
            </Link>
            <Link href="/explorer">
              <Button variant="outline" size="lg" className="text-lg">
                🔭 Explorer
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up animation-delay-800">
            <div className="card-cosmic text-center p-4 hover:shadow-horizon-sm transition-all duration-300 cursor-default group">
              <div className="text-2xl md:text-3xl font-bold text-horizon-gold mb-2 group-hover:scale-110 transition-transform">
                86137
              </div>
              <div className="text-sm text-starlight/60">
                Chain ID
              </div>
            </div>
            <div className="card-cosmic text-center p-4 hover:shadow-horizon-sm transition-all duration-300 cursor-default group">
              <div className="text-2xl md:text-3xl font-bold text-horizon-blue mb-2 group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="text-sm text-starlight/60">
                Validators Live
              </div>
            </div>
            <div className="card-cosmic text-center p-4 hover:shadow-horizon-sm transition-all duration-300 cursor-default group">
              <div className="text-2xl md:text-3xl font-bold text-horizon-orange mb-2 group-hover:scale-110 transition-transform">
                45K+
              </div>
              <div className="text-sm text-starlight/60">
                Target TPS
              </div>
            </div>
            <div className="card-cosmic text-center p-4 hover:shadow-horizon-sm transition-all duration-300 cursor-default group">
              <div className="text-2xl md:text-3xl font-bold text-horizon-purple mb-2 group-hover:scale-110 transition-transform">
                &lt;0.5s
              </div>
              <div className="text-sm text-starlight/60">
                Finality
              </div>
            </div>
          </div>
          
          {/* Network Info */}
          <div className="mt-12 card-cosmic max-w-md mx-auto animate-fade-in-up animation-delay-800">
            <h3 className="text-horizon-gold font-semibold mb-3 flex items-center justify-center gap-2">
              🌌 Add to MetaMask
            </h3>
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-starlight/60">Network:</span>
                <span className="text-starlight font-mono">Axionax Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-starlight/60">RPC URL:</span>
                <span className="text-horizon-blue font-mono text-xs">https://rpc.axionax.org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-starlight/60">Chain ID:</span>
                <span className="text-horizon-purple font-mono">86137</span>
              </div>
              <div className="flex justify-between">
                <span className="text-starlight/60">Symbol:</span>
                <span className="text-horizon-gold font-mono">AXX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-space to-transparent" />
    </section>
  );
}
