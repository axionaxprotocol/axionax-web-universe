import React from 'react';
import Badge from '@/components/ui/Badge';

// Roadmap component - Show project milestones and timeline
export default function Roadmap(): React.JSX.Element {
  const roadmapPhases = [
    {
      phase: 'Q4 2024',
      status: 'completed',
      title: 'Genesis & Testnet v1.0',
      items: [
        'Core blockchain implementation (Rust)',
        'PoPC consensus mechanism',
        'Basic RPC endpoints',
        'Initial testnet launch',
      ],
    },
    {
      phase: 'Q1 2025',
      status: 'completed',
      title: 'Infrastructure & Tools',
      items: [
        'Block explorer',
        'Faucet service',
        'TypeScript SDK release',
        'Comprehensive documentation',
      ],
    },
    {
      phase: 'Q2 2025',
      status: 'in-progress',
      title: 'Public Testnet',
      items: [
        'Public testnet launch (Current)',
        'Wallet integration',
        'Developer incentive program',
        'Community validator program',
      ],
    },
    {
      phase: 'Q3 2025',
      status: 'upcoming',
      title: 'Mainnet Preparation',
      items: [
        'Security audits',
        'Mainnet genesis',
        'Token distribution',
        'Exchange listings',
      ],
    },
    {
      phase: 'Q4 2025',
      status: 'upcoming',
      title: 'AI Infrastructure',
      items: [
        'On-chain AI model training',
        'GPU compute marketplace',
        'Decentralized inference',
        'AI dataset registry',
      ],
    },
    {
      phase: '2026',
      status: 'planned',
      title: 'Ecosystem Expansion',
      items: [
        'Cross-chain bridges',
        'DeFi protocols',
        'NFT marketplace',
        'DAOs & Governance',
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
      default:
        return <Badge variant="default">Planned</Badge>;
    }
  };

  return (
    <section className="section">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="gradient-text mb-4">Roadmap</h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Our journey to building the future of decentralized compute
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-primary hidden md:block" />

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
                <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-primary-500 rounded-full border-4 border-dark-950 transform md:-translate-x-1/2 hidden md:block" />

                <div
                  className={`card-hover ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-primary-400 font-medium mb-1">
                        {phase.phase}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {phase.title}
                      </h3>
                    </div>
                    {getStatusBadge(phase.status)}
                  </div>

                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3 text-dark-400"
                      >
                        <svg
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            phase.status === 'completed'
                              ? 'text-green-400'
                              : phase.status === 'in-progress'
                                ? 'text-yellow-400'
                                : 'text-dark-600'
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
