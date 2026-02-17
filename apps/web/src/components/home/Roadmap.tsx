import React from 'react';
import Badge from '@/components/ui/Badge';

// Roadmap component - Show project milestones and timeline
export default function Roadmap(): React.JSX.Element {
  const roadmapPhases = [
    {
      phase: 'Q4 2025',
      status: 'completed',
      title: 'v1.9.0 Production Ready',
      items: [
        'Rust Core (Consensus, Blockchain, Crypto)',
        'Python DeAI Layer (ASR, Fraud Detection)',
        'TypeScript SDK & PyO3 Bridge',
        'Public Testnet Launch ✓',
      ],
    },
    {
      phase: 'Q1 2026',
      status: 'active',
      title: 'Phase 2: DeAI & Expansion',
      items: [
        'DeAI Worker Integration (In Progress)',
        'RPC Infrastructure Optimization ✓',
        'Validator Network Growth',
        'Full Infrastructure Deployment ✓',
      ],
    },
    {
      phase: 'Q1-Q2 2026',
      status: 'in-progress',
      title: 'v2.0 Protocol Compliance & Testing',
      items: [
        'PoPC Parameters (s=1000, confidence=0.99) ✓',
        'ASR Configuration (K=64, max_quota=12.5%) ✓',
        'VRF Delay Implementation (k≥2) ✓',
        'Comprehensive Testing & Validation',
      ],
    },
    {
      phase: 'Q3 2026',
      status: 'upcoming',
      title: 'v2.1 Mainnet Prep',
      items: [
        'Security audits (Trail of Bits, OpenZeppelin)',
        'Permissionless validator registration',
        'Governance UI for AXX holders',
        'Emergency response system',
      ],
    },
    {
      phase: 'Q4 2026',
      status: 'planned',
      title: 'v2.0 Mainnet Genesis',
      items: [
        'Mainnet launch',
        'Complete SDK suite (Go, Rust, JS)',
        'Production marketplace',
        '100+ validator nodes',
      ],
    },
    {
      phase: '2027+',
      status: 'planned',
      title: 'Ecosystem & Beyond',
      items: [
        'Cross-chain bridges',
        '1,000+ global nodes',
        'Guardian Nodes in Space 🛰️',
        '$10M+ TVL target',
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'upcoming':
        return <Badge variant="info">Upcoming</Badge>;
      case 'active':
        return <Badge variant="success">Active</Badge>;
      default:
        return <Badge variant="default">Planned</Badge>;
    }
  };

  return (
    <section className="section bg-black-hole/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-content mb-4">
            Roadmap
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Our journey to building the future of decentralized compute
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-tech-cyan/20 via-tech-cyan/50 to-tech-cyan/20 hidden md:block" />

          <div className="space-y-12">
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative animate-fade-in-up ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'
                }`}
                style={
                  { animationDelay: `${index * 100}ms` } as React.CSSProperties
                }
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-tech-cyan rounded-full border-4 border-black-hole transform md:-translate-x-1/2 hidden md:block shadow-[0_0_10px_rgba(34,197,94,0.5)]" />

                <div
                  className={`card-panel p-6 hover:border-tech-cyan/30 transition-all duration-300 ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-tech-cyan font-medium mb-1">
                        {phase.phase}
                      </div>
                      <h3 className="text-xl font-bold text-content">
                        {phase.title}
                      </h3>
                    </div>
                    {getStatusBadge(phase.status)}
                  </div>

                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3 text-muted text-sm"
                      >
                        <svg
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            phase.status === 'completed'
                              ? 'text-tech-success'
                              : phase.status === 'in-progress' ||
                                  phase.status === 'active'
                                ? 'text-tech-cyan'
                                : 'text-muted'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
