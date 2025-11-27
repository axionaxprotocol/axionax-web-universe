'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
}

const FAUCET_AMOUNT = '10'; // 10 AXX per request

// Validate Ethereum address format
const isValidAddress = (addr: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
};

// Request tokens from faucet
const requestTokens = async (address: string): Promise<FaucetResponse> => {
  const response = await fetch('/api/faucet', {
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

  const mutation = useMutation({
    mutationFn: requestTokens,
    onSuccess: (data) => {
      setLastSuccess(data);
      setAddress(''); // Clear input on success
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
              Get free testnet AX tokens for development and testing
            </p>
          </div>

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
