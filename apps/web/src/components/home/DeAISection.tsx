import React from 'react';
import Link from 'next/link';

export default function DeAISection(): React.JSX.Element {
  return (
    <section className="section relative overflow-hidden bg-[#05050A]">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1020] border border-[#1E293B] text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Decentralized AI
            </div>

            {/* Heading: Next-Gen + DeAI (vibrant purple) + Layer */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-white">Next-Gen </span>
              <span className="text-[#BD8DFF]">DeAI</span>
              <span className="text-white"> Layer</span>
            </h2>

            {/* Description: body grey, "Python DeAI Layer" medium blue */}
            <p className="text-lg text-[#94A3B8] leading-relaxed max-w-xl">
              Axionax isn&apos;t just a blockchain—it&apos;s a decentralized
              intelligence network. Our unique{' '}
              <span className="text-[#6B9EFD]">Python DeAI Layer</span> allows
              validators to perform complex AI tasks like ASR (Automated Speech
              Recognition) and Fraud Detection directly on-chain.
            </p>

            {/* Feature List: checkmark in light blue/purple box (#4A4A63), titles white, desc dimmer grey */}
            <ul className="space-y-6 pt-2">
              {[
                {
                  title: 'Python Integration',
                  desc: 'Native PyO3 bindings for seamless AI model execution.',
                },
                {
                  title: 'Proof of Probabilistic Checking',
                  desc: 'Consensus mechanism optimized for non-deterministic AI outputs.',
                },
                {
                  title: 'Verifiable Inference',
                  desc: 'Cryptographically proven AI task execution.',
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#4A4A63] flex items-center justify-center text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8]/90 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Button: purple border, white text, hover fill purple */}
            <div className="pt-4">
              <Link href="/docs/deai">
                <button className="px-6 py-3 rounded-xl border-2 border-[#BD8DFF] text-white bg-transparent hover:bg-[#BD8DFF]/20 transition-all duration-300 font-semibold">
                  Explore DeAI Architecture
                </button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in-up animation-delay-200 lg:pl-8">
            <div className="relative rounded-2xl border border-white/5 bg-[#0D0B14] overflow-hidden shadow-2xl shadow-purple-900/20">
              {/* Top Bar */}
              <div className="flex items-center px-4 py-3 bg-[#1A1625] border-b border-white/5 relative">
                <div className="flex gap-2 absolute left-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="w-full text-center text-xs text-[#6B7280] font-mono">
                  deai_worker.py
                </div>
              </div>

              {/* Code: keywords red-orange, class/fn light blue, variables white, strings green, comments grey */}
              <div className="p-6 md:p-8 font-mono text-[13px] md:text-sm leading-relaxed overflow-x-auto">
                <div className="space-y-1.5 min-w-[400px]">
                  <div>
                    <span className="text-[#F06543]">import</span>{' '}
                    <span className="text-white">torch</span>
                  </div>
                  <div>
                    <span className="text-[#F06543]">from</span>{' '}
                    <span className="text-white">axionax.deai</span>{' '}
                    <span className="text-[#F06543]">import</span>{' '}
                    <span className="text-[#89DDFF]">Validator</span>
                  </div>
                  <div className="h-4" />
                  <div>
                    <span className="text-[#F06543]">class</span>{' '}
                    <span className="text-[#89DDFF]">DeAIWorker</span>
                    <span className="text-white">(Validator):</span>
                  </div>
                  <div className="pl-6">
                    <span className="text-[#F06543]">def</span>{' '}
                    <span className="text-[#89DDFF]">process_task</span>
                    <span className="text-white">(self, data):</span>
                  </div>
                  <div className="pl-12 text-[#9CA3AF]"># Load AI Model</div>
                  <div className="pl-12 text-white">
                    model = self.
                    <span className="text-[#89DDFF]">load_model</span>(
                    <span className="text-[#B0FC6D]">
                      &quot;whisper-v3&quot;
                    </span>
                    )
                  </div>
                  <div className="pl-12 text-white">
                    result = model.
                    <span className="text-[#89DDFF]">transcribe</span>(data)
                  </div>
                  <div className="h-4" />
                  <div className="pl-12 text-[#9CA3AF]">
                    # Submit Verification Proof
                  </div>
                  <div className="pl-12 text-white">
                    proof = self.
                    <span className="text-[#89DDFF]">generate_proof</span>
                    (result)
                  </div>
                  <div className="pl-12">
                    <span className="text-[#F06543]">return</span>{' '}
                    <span className="text-white">self.</span>
                    <span className="text-[#89DDFF]">submit_to_chain</span>
                    <span className="text-white">(proof)</span>
                  </div>
                </div>
              </div>

              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#A855F7]/20 rounded-full blur-3xl animate-pulse animation-delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
