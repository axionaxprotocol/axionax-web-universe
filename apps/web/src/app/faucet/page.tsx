'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FaucetResponse {
  success: boolean;
  message: string;
  txHash?: string;
  amount?: string;
  blockNumber?: number;
}

interface FaucetInfo {
  address: string;
  balance: string;
  symbol: string;
}

interface RecentTx {
  txHash: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed';
}

const FAUCET_AMOUNT = '100'; // 100 AXX per request

// Validate Ethereum address format
const isValidAddress = (addr: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
};

// Fetch faucet wallet balance
const fetchFaucetInfo = async (): Promise<FaucetInfo> => {
  const response = await fetch('https://faucet.axionax.org/balance');
  if (!response.ok) throw new Error('Failed to fetch faucet info');
  return (await response.json()) as FaucetInfo;
};

// Request tokens from faucet
const requestTokens = async (address: string): Promise<FaucetResponse> => {
  const response = await fetch('https://faucet.axionax.org/faucet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });

  const data = (await response.json()) as FaucetResponse;

  if (!response.ok) {
    throw new Error(data.message || 'Faucet request failed');
  }

  return data;
};

export default function Faucet(): React.JSX.Element {
  const [address, setAddress] = useState('');
  const [lastSuccess, setLastSuccess] = useState<FaucetResponse | null>(null);
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([]);

  // Fetch faucet balance
  const { data: faucetInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ['faucetInfo'],
    queryFn: fetchFaucetInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const mutation = useMutation({
    mutationFn: requestTokens,
    onSuccess: (data) => {
      setLastSuccess(data);
      setAddress(''); // Clear input on success
      // Add to recent transactions
      if (data.txHash) {
        setRecentTxs(prev => [{
          txHash: data.txHash!,
          to: address,
          amount: data.amount || FAUCET_AMOUNT,
          timestamp: Date.now(),
          status: 'confirmed'
        }, ...prev.slice(0, 4)]);
      }
    },
  });

  const handleClaim = (): void => {
    if (!address.trim()) {
      return;
    }

    if (!isValidAddress(address)) {
      return;
    }

    mutation.mutate(address);
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-deep-space relative">
      {/* Stars background */}
      <div className="stars" />
      
      <Navbar />
      <main className="container-custom py-24 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-horizon">💧 Testnet Faucet</span>
            </h1>
            <p className="text-starlight/70 text-lg">
              Get free testnet <span className="text-horizon-gold">AXX</span> tokens for development and testing
            </p>
          </div>

          {/* Faucet Balance Card */}
          <div className="card-cosmic mb-6 bg-gradient-to-r from-horizon-orange/10 via-horizon-purple/10 to-horizon-blue/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-starlight/50 text-sm mb-1">🏦 Faucet Balance</p>
                  <p className="text-3xl font-bold text-horizon-gold">
                    {isLoadingInfo ? '...' : formatBalance(faucetInfo?.balance || '0')} AXX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-starlight/50 text-sm mb-1">Per Request</p>
                  <p className="text-2xl font-bold text-horizon-orange">{FAUCET_AMOUNT} AXX</p>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="card-cosmic mb-6">
            <CardHeader>
              <CardTitle className="text-horizon-blue">🚀 Claim Testnet Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-starlight/70 mb-2">
                    Your Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value.trim())}
                    className="w-full px-4 py-3 bg-void border border-horizon-purple/30 rounded-lg text-starlight placeholder-starlight/30 focus:outline-none focus:border-horizon-orange focus:shadow-horizon-sm font-mono transition-all"
                    disabled={mutation.isPending}
                  />
                  {address && !isValidAddress(address) && (
                    <p className="text-horizon-pink text-sm mt-2">
                      ⚠️ Invalid Ethereum address format
                    </p>
                  )}
                </div>

                <button
                  className="btn-horizon w-full text-lg"
                  onClick={handleClaim}
                  disabled={mutation.isPending || !address || !isValidAddress(address)}
                >
                  {mutation.isPending
                    ? '⏳ Processing...'
                    : `🎁 Claim ${FAUCET_AMOUNT} AXX`}
                </button>

                {mutation.isError && (
                  <div className="p-4 rounded-lg bg-horizon-pink/10 border border-horizon-pink/30 text-horizon-pink">
                    ❌{' '}
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Failed to claim tokens. Please try again.'}
                  </div>
                )}

                {lastSuccess && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 space-y-2">
                    <div>✅ {lastSuccess.message}</div>
                    {lastSuccess.txHash && (
                      <div className="text-sm font-mono break-all text-green-300">
                        TX: {lastSuccess.txHash}
                      </div>
                    )}
                    <div className="text-xs text-green-300/70">
                      Check your wallet in a few seconds 🚀
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </div>

          {/* Recent Transactions */}
          {recentTxs.length > 0 && (
            <div className="card-cosmic mb-6">
              <CardHeader>
                <CardTitle className="text-horizon-purple">📋 Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTxs.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-void rounded-lg border border-horizon-purple/20 hover:border-horizon-orange/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${tx.status === 'confirmed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-horizon-gold animate-pulse'}`} />
                        <div>
                          <p className="text-sm font-mono text-starlight/70">
                            {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                          </p>
                          <p className="text-xs text-starlight/40">
                            {new Date(tx.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-horizon-gold">+{tx.amount} AXX</p>
                        <a
                          href={`https://explorer.axionax.org/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-starlight/40 hover:text-horizon-blue"
                        >
                          View TX →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          )}

          <div className="card-cosmic">
            <CardHeader>
              <CardTitle className="text-horizon">📚 Faucet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-starlight/60">
                <div className="flex items-start gap-3">
                  <div className="text-horizon-orange mt-1">💰</div>
                  <div>
                    <strong className="text-starlight">Amount:</strong>{' '}
                    {FAUCET_AMOUNT} AXX per request
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-horizon-purple mt-1">⏰</div>
                  <div>
                    <strong className="text-starlight">Cooldown:</strong> 24 hours
                    between requests
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-horizon-blue mt-1">🔗</div>
                  <div>
                    <strong className="text-starlight">Network:</strong> Axionax
                    Testnet (Chain ID: 86137)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-horizon-pink mt-1">🧪</div>
                  <div>
                    <strong className="text-starlight">Purpose:</strong> For testing
                    and development only
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="mt-8 text-center">
            <p className="text-starlight/40 text-sm">
              🌌 Need more tokens? Join our{' '}
              <a
                href="https://discord.gg/axionax"
                className="text-horizon-blue hover:text-horizon-purple transition-colors"
              >
                Discord
              </a>{' '}
              for developer support.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
