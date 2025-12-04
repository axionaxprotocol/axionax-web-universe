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

const VALIDATORS: Omit<ValidatorInfo, 'status' | 'blockHeight' | 'latency'>[] = [
  {
    name: 'Validator EU',
    location: 'Europe (Netherlands)',
    ip: '217.76.61.116',
    rpcUrl: 'http://217.76.61.116:8545',
    uptime: '99.9%',
    flag: '🇳🇱',
  },
  {
    name: 'Validator AU',
    location: 'Asia-Pacific (Australia)',
    ip: '46.250.244.4',
    rpcUrl: 'http://46.250.244.4:8545',
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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="container-custom py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Validator Leaderboard
          </h1>
          <p className="text-dark-400 text-lg">
            Live status of all axionax testnet validators
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400 text-sm">Online Validators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <span className={onlineCount === totalCount ? 'text-green-400' : 'text-yellow-400'}>
                  {onlineCount}
                </span>
                <span className="text-dark-500">/{totalCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400 text-sm">Highest Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                #{highestBlock.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400 text-sm">Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <span className={avgLatency < 200 ? 'text-green-400' : avgLatency < 500 ? 'text-yellow-400' : 'text-red-400'}>
                  {Math.round(avgLatency)}
                </span>
                <span className="text-dark-500 text-lg">ms</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400 text-sm">Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                Testnet v1.0
              </div>
              <div className="text-sm text-dark-400">Chain ID: 4918</div>
            </CardContent>
          </Card>
        </div>

        {/* Validator List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Validators</CardTitle>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 transition-colors"
            >
              ↻ Refresh
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-dark-400">
                Loading validators...
              </div>
            ) : (
              <div className="space-y-4">
                {validators?.map((validator, index) => (
                  <div
                    key={validator.ip}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-dark-900 rounded-lg border border-dark-800 hover:border-primary-500/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{validator.flag}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-white">{validator.name}</span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              👑 Leader
                            </span>
                          )}
                        </div>
                        <div className="text-dark-400 text-sm">{validator.location}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          validator.status === 'online' ? 'bg-green-500 animate-pulse' : 
                          validator.status === 'syncing' ? 'bg-yellow-500 animate-pulse' : 
                          'bg-red-500'
                        }`}></div>
                        <span className={`font-medium ${
                          validator.status === 'online' ? 'text-green-400' : 
                          validator.status === 'syncing' ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {validator.status.charAt(0).toUpperCase() + validator.status.slice(1)}
                        </span>
                      </div>

                      <div>
                        <span className="text-dark-500">Block:</span>
                        <span className="ml-1 font-mono text-white">#{validator.blockHeight.toLocaleString()}</span>
                      </div>

                      <div>
                        <span className="text-dark-500">Latency:</span>
                        <span className={`ml-1 font-mono ${
                          validator.latency < 200 ? 'text-green-400' : 
                          validator.latency < 500 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {validator.status === 'online' ? `${validator.latency}ms` : '-'}
                        </span>
                      </div>

                      <div>
                        <span className="text-dark-500">Uptime:</span>
                        <span className="ml-1 text-green-400">{validator.uptime}</span>
                      </div>

                      <div className="hidden md:block">
                        <span className="text-dark-500">RPC:</span>
                        <code className="ml-1 text-xs text-dark-400 bg-dark-800 px-2 py-1 rounded">
                          {validator.ip}:8545
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-dark-900/50 rounded-lg border border-dark-800">
          <h3 className="font-semibold text-primary-400 mb-2">📡 Want to become a validator?</h3>
          <p className="text-dark-400 text-sm">
            Join the axionax testnet as a validator! Check our{' '}
            <a href="https://docs.axionax.com/validators" className="text-primary-400 hover:underline">
              validator documentation
            </a>{' '}
            to get started. Validators earn rewards for securing the network and processing transactions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
