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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Testnet Faucet
            </h1>
            <p className="text-dark-400 text-lg">
              Get free testnet AXX tokens for development and testing
            </p>
          </div>

          {/* Faucet Balance Card */}
          <Card className="mb-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Faucet Balance</p>
                  <p className="text-3xl font-bold text-white">
                    {isLoadingInfo ? '...' : formatBalance(faucetInfo?.balance || '0')} AXX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-dark-400 text-sm mb-1">Per Request</p>
                  <p className="text-2xl font-bold text-primary-400">{FAUCET_AMOUNT} AXX</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Claim Testnet Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Wallet Address
                  </label>
                  <Input
                    type="text"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value.trim())}
                    className="w-full font-mono"
                    disabled={mutation.isPending}
                  />
                  {address && !isValidAddress(address) && (
                    <p className="text-red-400 text-sm mt-2">
                      Invalid Ethereum address format
                    </p>
                  )}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleClaim}
                  isLoading={mutation.isPending}
                  disabled={
                    mutation.isPending || !address || !isValidAddress(address)
                  }
                >
                  {mutation.isPending
                    ? 'Processing...'
                    : `Claim ${FAUCET_AMOUNT} AXX`}
                </Button>

                {mutation.isError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    ❌{' '}
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Failed to claim tokens. Please try again.'}
                  </div>
                )}

                {lastSuccess && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 space-y-2">
                    <div>✅ {lastSuccess.message}</div>
                    {lastSuccess.txHash && (
                      <div className="text-sm font-mono break-all">
                        TX: {lastSuccess.txHash}
                      </div>
                    )}
                    <div className="text-xs text-green-300">
                      Check your wallet in a few seconds
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          {recentTxs.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTxs.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${tx.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                        <div>
                          <p className="text-sm font-mono text-dark-300">
                            {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                          </p>
                          <p className="text-xs text-dark-500">
                            {new Date(tx.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-400">+{tx.amount} AXX</p>
                        <a
                          href={`https://explorer.axionax.org/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-dark-500 hover:text-primary-400"
                        >
                          View TX →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Faucet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-dark-400">
                <div className="flex items-start gap-3">
                  <div className="text-primary-500 mt-1">•</div>
                  <div>
                    <strong className="text-white">Amount:</strong>{' '}
                    {FAUCET_AMOUNT} AXX per request
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500 mt-1">•</div>
                  <div>
                    <strong className="text-white">Cooldown:</strong> 24 hours
                    between requests
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500 mt-1">•</div>
                  <div>
                    <strong className="text-white">Network:</strong> Axionax
                    Testnet (Chain ID: 86137)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500 mt-1">•</div>
                  <div>
                    <strong className="text-white">Purpose:</strong> For testing
                    and development only
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-dark-500 text-sm">
              Need more tokens? Join our{' '}
              <a
                href="https://discord.gg/axionax"
                className="text-primary-400 hover:text-primary-300"
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
