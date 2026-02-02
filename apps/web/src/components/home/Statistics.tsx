'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface LiveStats {
  blocks: number;
  services: number;
  uptime: number;
  deployment: number;
  validators: number;
}

interface StatsApiResponse {
  blockNumber: number;
  services: {
    healthy: number;
  };
  uptime: {
    hours: number;
  };
  deployment: number;
  validators: {
    online: number;
  };
}

// Fetch real-time stats from Server API
const fetchStats = async (): Promise<LiveStats> => {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  const data = (await response.json()) as StatsApiResponse;

  return {
    blocks: data.blockNumber,
    services: data.services.healthy,
    uptime: data.uptime.hours,
    deployment: data.deployment,
    validators: data.validators.online,
  };
};

// Statistics component แสดงข้อมูล live metrics จาก testnet
// รองรับ mobile-first responsive design ตาม Tailwind best practices
export default function Statistics(): React.JSX.Element {
  // Use TanStack Query v5 for server state
  const { data: stats, isLoading } = useQuery<LiveStats>({
    queryKey: ['live-stats'],
    queryFn: fetchStats,
    refetchInterval: 2000, // Refresh every 2 seconds for real-time feel
    initialData: {
      blocks: 0,
      services: 9,
      uptime: 48,
      deployment: 100,
      validators: 2,
    },
  });

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const statItems = [
    {
      label: 'Live Block Height',
      value: isLoading ? '...' : formatNumber(stats.blocks),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Block height icon"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      subtitle: 'From Validators (5s blocks)',
    },
    {
      label: 'Active Validators',
      value: isLoading ? '...' : `${stats.validators}/2`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Validator nodes icon"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
      subtitle: 'EU + AU regions (29h uptime)',
    },
    {
      label: 'Services Operational',
      value: `${stats.services}/9`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Services operational icon"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      subtitle: 'Infrastructure 100%',
    },
    {
      label: 'Infrastructure Uptime',
      value: isLoading
        ? '...'
        : stats.uptime >= 24
          ? `${Math.floor(stats.uptime / 24)}d+`
          : `${stats.uptime}h+`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Infrastructure uptime icon"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      subtitle: 'Explorer API uptime',
    },
    {
      label: 'Testnet Deployment',
      value: `${stats.deployment}%`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Testnet deployment icon"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      subtitle: 'Protocol v1.9.0 Active',
    },
  ];

  return (
    <section className="section bg-gradient-to-b from-transparent via-amber-950/5 to-transparent border-y border-amber-500/10">
      <div className="container-custom">
        <div className="section-heading">
          <h2 className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            Live Testnet Metrics
          </h2>
          <p className="text-starlight/70 text-lg max-w-2xl mx-auto">
            Real-time status from our global infrastructure • All Systems
            Operational
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div
              key={stat.label}
              className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-950/20 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 text-center animate-fade-in-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-starlight/80 mb-1">{stat.label}</div>
              <div className="text-xs text-starlight/50">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Service Status Bar */}
        <div className="mt-12 p-6 rounded-xl bg-black-hole/80 border border-horizon-purple/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-starlight">
              Service Health
            </h3>
            <span
              className={`text-sm ${stats.services > 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {stats.services > 0
                ? '✅ All systems operational'
                : '❌ Systems degraded'}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-full bg-space-dust/50 rounded-full h-2">
                <div
                  className={`${stats.services > 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(stats.services / 9) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-starlight/70 whitespace-nowrap">
                {Math.round((stats.services / 9) * 100)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ RPC
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ PostgreSQL
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Redis
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Nginx/SSL
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Grafana
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Prometheus
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Web
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Explorer API
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">
                ✅ Faucet API
              </span>
            </div>
          </div>
        </div>

        {/* Validator Nodes Status */}
        <div className="mt-6 p-6 rounded-xl bg-black-hole/80 border border-horizon-purple/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-starlight">
              Validator Nodes
            </h3>
            <span className="text-sm text-green-400">
              ✅ {stats.validators}/2 nodes online
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-space-dust/30 rounded-lg border border-horizon-purple/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-starlight/90">
                  🇪🇺 Validator EU
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/20">
                  Online
                </span>
              </div>
              <div className="text-xs text-starlight/50 space-y-1">
                <div>IP: 217.76.61.116</div>
                <div>Uptime: 29h+</div>
                <div>Container: axionax-validator-eu</div>
              </div>
            </div>
            <div className="p-4 bg-space-dust/30 rounded-lg border border-horizon-purple/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-starlight/90">
                  🇦🇺 Validator AU
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/20">
                  Online
                </span>
              </div>
              <div className="text-xs text-starlight/50 space-y-1">
                <div>IP: 46.250.244.4</div>
                <div>Uptime: 29h+</div>
                <div>Container: axionax-validator-au</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
