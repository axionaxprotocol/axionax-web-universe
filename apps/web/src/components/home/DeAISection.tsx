import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function DeAISection(): React.JSX.Element {
  return (
    <section className="section relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Decentralized AI
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-starlight">Next-Gen </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                DeAI Layer
              </span>
            </h2>
            
            <p className="text-lg text-starlight/70 leading-relaxed">
              Axionax isn't just a blockchain—it's a decentralized intelligence network. 
              Our unique <span className="text-blue-400">Python DeAI Layer</span> allows validators to perform complex AI tasks like ASR (Automated Speech Recognition) and Fraud Detection directly on-chain.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                { title: 'Python Integration', desc: 'Native PyO3 bindings for seamless AI model execution.' },
                { title: 'Proof of Probabilistic Checking', desc: 'Consensus mechanism optimized for non-deterministic AI outputs.' },
                { title: 'Verifiable Inference', desc: 'Cryptographically proven AI task execution.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-starlight font-semibold">{item.title}</h3>
                    <p className="text-sm text-starlight/60">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link href="/docs/deai">
                <Button variant="outline" size="lg" className="border-blue-500/30 hover:border-blue-500/60 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                  Explore DeAI Architecture
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-blue-900/20">
              {/* Code/Terminal Window */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs text-starlight/40 font-mono ml-2">deai_worker.py</div>
              </div>
              
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-1">
                  <div className="text-pink-400">import <span className="text-white">torch</span></div>
                  <div className="text-pink-400">from <span className="text-white">axionax.deai</span> import <span className="text-yellow-300">Validator</span></div>
                  <div className="h-4" />
                  <div className="text-blue-400">class <span className="text-yellow-300">DeAIWorker</span><span className="text-white">(Validator):</span></div>
                  <div className="pl-4 text-starlight">
                    <span className="text-blue-400">def</span> <span className="text-yellow-300">process_task</span>(self, data):
                  </div>
                  <div className="pl-8 text-green-400"># Load AI Model</div>
                  <div className="pl-8 text-starlight">model = self.load_model(<span className="text-orange-300">"whisper-v3"</span>)</div>
                  <div className="pl-8 text-starlight">result = model.transcribe(data)</div>
                  <div className="h-4" />
                  <div className="pl-8 text-green-400"># Submit Verification Proof</div>
                  <div className="pl-8 text-starlight">proof = self.generate_proof(result)</div>
                  <div className="pl-8 text-pink-400">return <span className="text-starlight">self.submit_to_chain(proof)</span></div>
                </div>
              </div>

              {/* Glowing overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
