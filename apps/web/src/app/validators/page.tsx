'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ValidatorInfo {
  name: string;
  location: string;
  ip: string;
  rpcUrl: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  latency: number;
  uptime: string;
  isLeader?: boolean;
}

const VALIDATORS: Omit<ValidatorInfo, 'status' | 'blockHeight' | 'latency'>[] =
  [
    {
      name: 'AU Validator AU',
      location: 'Asia-Pacific (Australia)',
      ip: '46.250.244.4',
      rpcUrl: '/api/rpc/au',
      uptime: '99.8%',
    },
    {
      name: 'NL Validator EU',
      location: 'Europe (Netherlands)',
      ip: '217.76.61.116',
      rpcUrl: '/api/rpc/eu',
      uptime: '99.9%',
    },
  ];

const checkValidator = async (
  rpcUrl: string
): Promise<{
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  latency: number;
}> => {
  const start = Date.now();
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - start;
    const data = await response.json();
    const blockHeight = parseInt(data.result, 16);

    return { status: 'online', blockHeight, latency };
  } catch {
    return { status: 'offline', blockHeight: 0, latency: 0 };
  }
};

const fetchAllValidators = async (): Promise<ValidatorInfo[]> => {
  const results = await Promise.all(
    VALIDATORS.map(async (v) => {
      const { status, blockHeight, latency } = await checkValidator(v.rpcUrl);
      return { ...v, status, blockHeight, latency };
    })
  );
  // Sort by block height, highest first (leader)
  const sorted = results.sort((a, b) => b.blockHeight - a.blockHeight);
  if (sorted.length > 0) sorted[0].isLeader = true;
  return sorted;
};

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 flex items-center gap-4">
      <div className="text-2xl text-gray-400">{icon}</div>
      <div>
        <div className="text-gray-400 text-sm">{label}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
        {sublabel && <div className="text-gray-500 text-xs">{sublabel}</div>}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: 'online' | 'offline' | 'syncing' }) {
  const styles = {
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    syncing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${styles[status]}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-400' : status === 'syncing' ? 'bg-yellow-400' : 'bg-red-400'}`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Leader Badge Component
function LeaderBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-xs font-medium">
      📍 Leader
    </span>
  );
}

export default function ValidatorsPage(): React.JSX.Element {
  const {
    data: validators,
    isLoading,
    refetch,
  } = useQuery<ValidatorInfo[]>({
    queryKey: ['validators'],
    queryFn: fetchAllValidators,
    refetchInterval: 10000,
  });

  const onlineCount =
    validators?.filter((v) => v.status === 'online').length || 0;
  const totalCount = validators?.length || VALIDATORS.length;
  const avgLatency = Math.round(
    (validators
      ?.filter((v) => v.status === 'online')
      .reduce((acc, v) => acc + v.latency, 0) || 0) / (onlineCount || 1)
  );
  const highestBlock = validators?.[0]?.blockHeight || 0;

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Network Status Header */}
        <h1 className="text-3xl font-bold text-white mb-6">Network Status</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
            }
            label="Online Validators"
            value={`${onlineCount}/${totalCount}`}
          />
          <StatCard
            icon={<span className="text-gray-400">⬆</span>}
            label="Highest Block"
            value={`#${highestBlock.toLocaleString()}`}
          />
          <StatCard
            icon={<span className="text-gray-400">⚡</span>}
            label="Avg Latency"
            value={`${avgLatency}ms`}
          />
          <StatCard
            icon={<span className="text-gray-400">🌐</span>}
            label="Network"
            value="Testnet v1.9.0"
            sublabel="Chain ID: 86137"
          />
        </div>

        {/* Validators Section */}
        <div className="bg-[#1a1a2e] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-orange-400">◇</span> Validators
            </h2>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#252538] hover:bg-[#2f2f45] text-gray-300 rounded-lg text-sm transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Validator List */}
          <div className="divide-y divide-gray-700/30">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2" />
                Loading validators...
              </div>
            ) : (
              validators?.map((validator) => (
                <div
                  key={validator.ip}
                  className="p-6 hover:bg-[#1f1f35] transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Validator Info */}
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">
                            {validator.name}
                          </span>
                          {validator.isLeader && <LeaderBadge />}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {validator.location}
                        </div>
                      </div>
                    </div>

                    {/* Status & Stats */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <StatusBadge status={validator.status} />

                      <div>
                        <span className="text-gray-500">Block: </span>
                        <span className="text-white font-mono">
                          #{validator.blockHeight.toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">Latency: </span>
                        <span
                          className={`font-mono ${
                            validator.latency < 200
                              ? 'text-green-400'
                              : validator.latency < 500
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {validator.status === 'online'
                            ? `${validator.latency}ms`
                            : '-'}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">Uptime: </span>
                        <span className="text-green-400">
                          {validator.uptime}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">RPC: </span>
                        <span className="text-gray-400 font-mono">
                          {validator.ip}:8545
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Join Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-xl p-6 border border-orange-500/20">
          <h3 className="font-semibold text-white mb-2">
            📡 Want to become a validator?
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Join the Axionax testnet as a Validator, Worker, or RPC Node! Earn
            rewards for securing the network and processing transactions.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/join"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              🚀 Join Network
            </a>
            <a
              href="/docs"
              className="px-6 py-3 bg-[#1a1a2e] border border-gray-600 text-gray-300 hover:bg-[#252538] rounded-lg transition-all"
            >
              📚 Documentation
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
