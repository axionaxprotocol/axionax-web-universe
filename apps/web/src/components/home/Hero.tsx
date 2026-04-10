import React from 'react';
import Link from 'next/link';

// Hero component - Landing page hero section with Black Hole / Event Horizon theme
export default function Hero(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>
      
      {/* Dynamic Light Beam */}
      <div className="absolute inset-x-0 top-[-20%] h-[500px] w-full bg-gradient-to-b from-tech-cyan/20 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Cyber/Blockchain Network Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1000px]">
        {/* Outer orbital ring */}
        <div
          className="absolute w-[320px] h-[320px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full opacity-20 border-[1px] border-dashed border-tech-cyan"
          style={{
            animation: 'spin 40s linear infinite',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
          }}
        />

        {/* Middle orbital ring */}
        <div
          className="absolute w-[240px] h-[240px] md:w-[380px] md:h-[380px] lg:w-[550px] lg:h-[550px] rounded-full opacity-30 border-[1px] border-tech-cyan/50 shadow-[0_0_30px_rgba(96,165,250,0.2)_inset]"
          style={{
            animation: 'spin 30s linear infinite reverse',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(45deg)',
          }}
        />

        {/* Inner orbital ring */}
        <div
          className="absolute w-[160px] h-[160px] md:w-[260px] md:h-[260px] lg:w-[400px] lg:h-[400px] rounded-full opacity-40 border-[2px] border-tech-cyan shadow-[0_0_40px_rgba(168,85,247,0.3)]"
          style={{
            animation: 'spin 20s linear infinite',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(0deg)',
          }}
        />

        {/* Core Node with Logo */}
        <div
          className="absolute w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-tech-cyan/50"
          style={{
            boxShadow: '0 0 50px rgba(96,165,250,0.5), inset 0 0 30px rgba(168,85,247,0.4)',
          }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-tech-cyan"></div>
          <img
            src="/assets/img/axionax-logo-new.png"
            alt="Axionax Core Node"
            className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover z-10"
            style={{ filter: 'drop-shadow(0 0 15px rgba(96,165,250,0.8))' }}
          />
        </div>

        {/* Floating Data Nodes */}
        <div className="absolute w-full h-full max-w-[800px] max-h-[800px]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 md:w-3 md:h-3 rounded-sm bg-tech-cyan"
              style={{
                top: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                left: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 15px rgba(96,165,250,0.8), 0 0 30px rgba(168,85,247,0.6)',
                transform: 'rotate(45deg)',
              }}
            >
              {/* Connecting line illusion */}
              <div className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-tech-cyan/30 -translate-y-1/2 origin-left rotate-45"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-custom relative z-10 w-full mt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-tech-cyan/10 border border-tech-cyan/30 rounded-full text-tech-cyan text-sm font-medium backdrop-blur-md shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_25px_rgba(96,165,250,0.4)] transition-all duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tech-success shadow-[0_0_10px_rgba(39,201,63,0.8)]"></span>
              </span>
              <span className="tracking-wide uppercase text-xs sm:text-sm">Mainnet Beta Active • Chain ID 86137</span>
            </div>
          </div>

          {/* Main Heading - single line on md+ for cleaner look */}
          <h1 className="mb-6 animate-fade-in-up text-balance lg:whitespace-nowrap" style={{ animationDelay: '0.1s' }}>
            <span className="block text-starlight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2 text-4xl md:text-5xl font-semibold">
              Next-Gen Protocol
            </span>
            <span
              className="text-5xl md:text-7xl bg-gradient-to-r from-tech-cyan via-purple-500 to-tech-cyan bg-[length:200%_auto] animate-[horizonPulse_3s_ease-in-out_infinite] bg-clip-text text-transparent relative inline-block uppercase tracking-wider font-black mt-2"
            >
              Axionax Web Universe
              <div className="absolute -inset-2 blur-3xl bg-gradient-to-r from-tech-cyan/30 via-purple-500/30 to-tech-cyan/30 -z-10 animate-pulse"></div>
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-starlight/80 mb-10 max-w-3xl mx-auto animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
            <span className="text-tech-cyan font-bold drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">Axionax Core</span>{' '}
            — Decentralized computation layer built on{' '}
            <span className="text-purple-400 font-semibold drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
              Substrate
            </span>. Accelerate your AI models and rent high-performance GPU instances with zero downtime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/join">
              <button className="group relative px-8 py-4 bg-tech-cyan/10 border border-tech-cyan text-tech-cyan font-bold uppercase tracking-wider overflow-hidden rounded-md transition-colors duration-300 w-full sm:w-auto flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]">
                <div className="absolute inset-0 bg-tech-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                <span className="relative z-10 group-hover:text-[#05050A] transition-colors duration-300">Deploy Node</span>
                <svg
                  className="relative z-10 w-5 h-5 group-hover:text-[#05050A] transition-colors duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Deploy icon"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="px-8 py-4 bg-transparent border border-starlight/20 text-starlight hover:bg-starlight/10 hover:border-starlight/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] font-bold uppercase tracking-wider rounded-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 backdrop-blur-sm">
                Access Network
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>

          {/* Quick Stats - Minimalist */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up w-full mt-10" style={{ animationDelay: '0.4s' }}>
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors duration-300">
              <div className="text-2xl md:text-3xl font-medium text-white mb-1">
                86137
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">Chain ID</div>
            </div>
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors duration-300">
              <div className="text-2xl md:text-3xl font-medium text-white mb-1">
                2
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">Live Cores</div>
            </div>
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors duration-300">
              <div className="text-2xl md:text-3xl font-medium text-white mb-1">
                45K+
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">Target TPS</div>
            </div>
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors duration-300">
              <div className="text-2xl md:text-3xl font-medium text-white mb-1">
                &lt;0.5s
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">Finality</div>
            </div>
          </div>

          {/* Network Info - Clean */}
          <div className="mt-8 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 max-w-md mx-auto animate-fade-in-up w-full text-left hover:border-white/10 transition-colors duration-300" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-white/80 font-medium mb-4 flex items-center gap-3">
              <img
                src="/assets/img/axx-token.png"
                alt="AXX Token"
                className="w-6 h-6 rounded-full"
              />
              Network Configuration
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/40">Network</span>
                <span className="text-white/90 font-medium">Axionax Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">RPC Endpoint</span>
                <span className="text-white/90 font-mono text-xs bg-white/5 px-2 py-1 rounded">https://rpc.axionax.org</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Chain ID</span>
                <span className="text-white/90 font-mono">86137</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Symbol</span>
                <span className="text-white/90 font-mono">AXX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
