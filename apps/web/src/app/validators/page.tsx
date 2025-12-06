'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ValidatorInfo {
  name: string;
  location: string;
  ip: string;
  rpcUrl: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  latency: number;
  uptime: string;
  flag: string;
}

// Use relative URLs for proxy - works with both dev and production
const getProxyUrl = (endpoint: string) => {
  if (typeof window !== 'undefined') {
    // In browser, use relative URL (goes through nginx proxy)
    return endpoint;
  }
  return endpoint;
};

const VALIDATORS: Omit<ValidatorInfo, 'status' | 'blockHeight' | 'latency'>[] = [
  {
    name: 'Validator EU',
    location: 'Europe (Netherlands)',
    ip: '217.76.61.116',
    rpcUrl: '/api/rpc/eu', // Proxied through nginx
    uptime: '99.9%',
    flag: '🇳🇱',
  },
  {
    name: 'Validator AU',
    location: 'Asia-Pacific (Australia)',
    ip: '46.250.244.4',
    rpcUrl: '/api/rpc/au', // Proxied through nginx
    uptime: '99.8%',
    flag: '🇦🇺',
  },
];

const checkValidator = async (rpcUrl: string): Promise<{ status: 'online' | 'offline' | 'syncing'; blockHeight: number; latency: number }> => {
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
    
    return {
      status: 'online',
      blockHeight,
      latency,
    };
  } catch {
    return {
      status: 'offline',
      blockHeight: 0,
      latency: 0,
    };
  }
};

const fetchAllValidators = async (): Promise<ValidatorInfo[]> => {
  const results = await Promise.all(
    VALIDATORS.map(async (v) => {
      const { status, blockHeight, latency } = await checkValidator(v.rpcUrl);
      return {
        ...v,
        status,
        blockHeight,
        latency,
      };
    })
  );
  return results.sort((a, b) => b.blockHeight - a.blockHeight);
};

export default function ValidatorsPage(): React.JSX.Element {
  const { data: validators, isLoading, refetch } = useQuery<ValidatorInfo[]>({
    queryKey: ['validators'],
    queryFn: fetchAllValidators,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const onlineCount = validators?.filter(v => v.status === 'online').length || 0;
  const totalCount = validators?.length || VALIDATORS.length;
  const avgLatency = (validators?.filter(v => v.status === 'online').reduce((acc, v) => acc + v.latency, 0) || 0) / (onlineCount || 1);
  const highestBlock = validators?.[0]?.blockHeight || 0;

  return (
    <div className="min-h-screen bg-deep-space relative">
      {/* Stars background */}
      <div className="stars" />
      
      <Navbar />
      <main className="container-custom py-24 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-horizon">⚡ Validator Leaderboard</span>
          </h1>
          <p className="text-starlight/70 text-lg">
            Live status of all <span className="text-horizon-blue">Axionax</span> testnet validators
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-orange text-sm">🟢 Online Validators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <span className={onlineCount === totalCount ? 'text-green-400' : 'text-horizon-gold'}>
                  {onlineCount}
                </span>
                <span className="text-starlight/30">/{totalCount}</span>
              </div>
            </CardContent>
          </div>

          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-purple text-sm">⛓️ Highest Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-horizon-gold">
                #{highestBlock.toLocaleString()}
              </div>
            </CardContent>
          </div>

          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-blue text-sm">📡 Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <span className={avgLatency < 200 ? 'text-green-400' : avgLatency < 500 ? 'text-horizon-gold' : 'text-horizon-pink'}>
                  {Math.round(avgLatency)}
                </span>
                <span className="text-starlight/30 text-lg">ms</span>
              </div>
            </CardContent>
          </div>

          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-pink text-sm">🌐 Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-starlight">
                Testnet v1.0
              </div>
              <div className="text-sm text-starlight/50">Chain ID: 86137</div>
            </CardContent>
          </div>
        </div>

        {/* Validator List */}
        <div className="card-cosmic">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-horizon">🛡️ Validators</CardTitle>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-void hover:bg-space-dust border border-horizon-purple/30 hover:border-horizon-orange/50 rounded-lg text-sm text-starlight/70 transition-all hover:shadow-horizon-sm"
            >
              ↻ Refresh
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-starlight/50">
                <div className="loading-spinner w-8 h-8 mx-auto mb-2"></div>
                Loading validators from the cosmos...
              </div>
            ) : (
              <div className="space-y-4">
                {validators?.map((validator, index) => (
                  <div
                    key={validator.ip}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-void rounded-xl border border-horizon-purple/20 hover:border-horizon-orange/50 hover:shadow-horizon-sm transition-all duration-300 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{validator.flag}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-starlight">{validator.name}</span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-horizon-gold/20 text-horizon-gold text-xs rounded-full border border-horizon-gold/30">
                              👑 Leader
                            </span>
                          )}
                        </div>
                        <div className="text-starlight/50 text-sm">{validator.location}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          validator.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                          validator.status === 'syncing' ? 'bg-horizon-gold animate-pulse' : 
                          'bg-horizon-pink'
                        }`}></div>
                        <span className={`font-medium ${
                          validator.status === 'online' ? 'text-green-400' : 
                          validator.status === 'syncing' ? 'text-horizon-gold' : 
                          'text-horizon-pink'
                        }`}>
                          {validator.status.charAt(0).toUpperCase() + validator.status.slice(1)}
                        </span>
                      </div>

                      <div>
                        <span className="text-starlight/40">Block:</span>
                        <span className="ml-1 font-mono text-horizon-purple">#{validator.blockHeight.toLocaleString()}</span>
                      </div>

                      <div>
                        <span className="text-starlight/40">Latency:</span>
                        <span className={`ml-1 font-mono ${
                          validator.latency < 200 ? 'text-green-400' : 
                          validator.latency < 500 ? 'text-horizon-gold' : 
                          'text-horizon-pink'
                        }`}>
                          {validator.status === 'online' ? `${validator.latency}ms` : '-'}
                        </span>
                      </div>

                      <div>
                        <span className="text-starlight/40">Uptime:</span>
                        <span className="ml-1 text-green-400">{validator.uptime}</span>
                      </div>

                      <div className="hidden md:block">
                        <span className="text-starlight/40">RPC:</span>
                        <code className="ml-1 text-xs text-starlight/50 bg-void border border-horizon-purple/20 px-2 py-1 rounded">
                          {validator.ip}:8545
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        {/* Info Section */}
        <div className="mt-8 card-cosmic bg-gradient-to-r from-horizon-orange/5 via-horizon-purple/5 to-horizon-blue/5">
          <h3 className="font-semibold text-horizon mb-4">📡 Want to become a validator?</h3>
          <p className="text-starlight/60 text-sm mb-4">
            Join the <span className="text-horizon-blue">Axionax</span> testnet as a Validator, Worker, or RPC Node!
            Earn rewards for securing the network and processing transactions.
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="/join" 
              className="px-6 py-3 bg-gradient-to-r from-horizon-orange to-horizon-purple text-white font-semibold rounded-lg hover:shadow-horizon transition-all"
            >
              🚀 Join Network
            </a>
            <a 
              href="/docs" 
              className="px-6 py-3 bg-void border border-horizon-purple/30 text-starlight hover:border-horizon-orange/50 rounded-lg transition-all"
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
