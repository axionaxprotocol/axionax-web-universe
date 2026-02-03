'use client';

import React, { useState, useEffect } from 'react';
import MockBadge from '@/components/ui/MockBadge';

interface ValidatorInfo {
  name: string;
  location: string;
  ip: string;
  blockHeight: number | null;
  peerCount: number | null;
  status: 'online' | 'offline' | 'checking';
  latency: number | null;
}

const VALIDATORS = [
  {
    name: 'Validator EU',
    location: 'Europe',
    ip: '217.76.61.116',
    rpcUrl: '/api/rpc/eu',
  },
  {
    name: 'Validator AU',
    location: 'Australia',
    ip: '46.250.244.4',
    rpcUrl: '/api/rpc/au',
  },
];

async function fetchValidatorInfo(rpcUrl: string): Promise<{
  blockHeight: number | null;
  peerCount: number | null;
  latency: number;
}> {
  const startTime = Date.now();
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
    });
    const data = await response.json();
    const blockHeight = parseInt(data.result, 16);

    // Get peer count
    const peerResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'net_peerCount',
        params: [],
        id: 2,
      }),
    });
    const peerData = await peerResponse.json();
    const peerCount = peerData.result ? parseInt(peerData.result, 16) : 0;

    return {
      blockHeight,
      peerCount,
      latency: Date.now() - startTime,
    };
  } catch {
    return {
      blockHeight: null,
      peerCount: null,
      latency: Date.now() - startTime,
    };
  }
}

export default function ValidatorStatus(): React.JSX.Element {
  const [validators, setValidators] = useState<ValidatorInfo[]>(
    VALIDATORS.map((v) => ({
      name: v.name,
      location: v.location,
      ip: v.ip,
      blockHeight: null,
      peerCount: null,
      status: 'checking' as const,
      latency: null,
    }))
  );

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        VALIDATORS.map(async (v) => {
          const info = await fetchValidatorInfo(v.rpcUrl);
          return {
            name: v.name,
            location: v.location,
            ip: v.ip,
            blockHeight: info.blockHeight,
            peerCount: info.peerCount,
            status: info.blockHeight !== null ? 'online' : 'offline',
            latency: info.latency,
          } as ValidatorInfo;
        })
      );
      setValidators(results);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500 animate-pulse';
    }
  };

  const getLocationFlag = (location: string) => {
    switch (location) {
      case 'Europe':
        return '🇪🇺';
      case 'Australia':
        return '🇦🇺';
      default:
        return '🌍';
    }
  };

  const onlineCount = validators.filter((v) => v.status === 'online').length;
  const allOffline = validators.every((v) => v.status === 'offline');
  const isChecking = validators.some((v) => v.status === 'checking');

  return (
    <section className="section bg-dark-900/50" data-testid="network-status" aria-label={onlineCount > 0 ? 'Connected' : 'Checking'}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Validator Network</span>
            </h2>
            <MockBadge show={!isChecking && allOffline} label="Unavailable" />
          </div>
          <p className="text-dark-300 text-lg">
            Real-time status of axionax validators running PoPC consensus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {validators.map((validator, index) => (
            <div
              key={index}
              className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {getLocationFlag(validator.location)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg">{validator.name}</h3>
                    <p className="text-dark-400 text-sm">
                      {validator.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${getStatusColor(validator.status)}`}
                  />
                  <span className="text-sm capitalize text-dark-300">
                    {validator.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-900/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary-400">
                    {validator.blockHeight !== null
                      ? validator.blockHeight.toLocaleString()
                      : '---'}
                  </div>
                  <div className="text-dark-400 text-sm">Block Height</div>
                </div>
                <div className="bg-dark-900/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-secondary-400">
                    {validator.peerCount !== null ? validator.peerCount : '---'}
                  </div>
                  <div className="text-dark-400 text-sm">Peers</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700 flex justify-between items-center text-sm">
                <code className="text-dark-400 bg-dark-900/50 px-2 py-1 rounded">
                  {validator.ip}:8545
                </code>
                {validator.latency !== null && (
                  <span className="text-dark-400">
                    {validator.latency}ms latency
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-dark-400 text-sm">
            ✓ Connected via PoPC Consensus • Chain ID: 86137 • Updates every 10s
          </p>
        </div>
      </div>
    </section>
  );
}
