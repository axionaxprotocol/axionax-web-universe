'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RPC_URLS } from '@axionax/blockchain-utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  txCount: number;
  gas: string;
  gasUsed: string;
  validator: string;
  size: number;
}

interface BlocksResponse {
  blocks: Block[];
  total: number;
  page: number;
  pageSize: number;
  latestBlock: number;
}

interface AddressInfo {
  address: string;
  balance: string;
  nonce: number;
}

// ใช้ RPC จาก centralized config หรือ env var
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || RPC_URLS.TESTNET[0];

const fetchBlocks = async (): Promise<BlocksResponse> => {
  const response = await fetch('/api/blocks?page=1&pageSize=10');
  if (!response.ok) throw new Error('Failed to fetch blocks');
  return (await response.json()) as BlocksResponse;
};

const fetchAddressBalance = async (address: string): Promise<AddressInfo> => {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    }),
  });
  const data = await response.json();
  const balanceWei = BigInt(data.result || '0x0');
  const balanceEth = Number(balanceWei) / 1e18;

  // Get nonce
  const nonceRes = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [address, 'latest'],
      id: 2,
    }),
  });
  const nonceData = await nonceRes.json();

  return {
    address,
    balance: balanceEth.toFixed(4),
    nonce: parseInt(nonceData.result || '0x0', 16),
  };
};

const fetchTransaction = async (hash: string) => {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [hash],
      id: 1,
    }),
  });
  const data = await response.json();
  return data.result;
};

const formatTimestamp = (timestamp: number): string => {
  // API returns timestamp in seconds, Date.now() returns milliseconds
  const timestampMs = timestamp * 1000;
  const seconds = Math.floor((Date.now() - timestampMs) / 1000);
  if (seconds < 0) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function Explorer(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'tx' | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: blocksData, isLoading } = useQuery<BlocksResponse>({
    queryKey: ['blocks'],
    queryFn: fetchBlocks,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      // Detect search type
      if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        // Transaction hash
        setSearchType('tx');
        const tx = await fetchTransaction(searchQuery);
        if (tx) {
          setSearchResult(tx);
        } else {
          setSearchError('Transaction not found');
        }
      } else if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
        // Address
        setSearchType('address');
        const info = await fetchAddressBalance(searchQuery);
        setSearchResult(info);
      } else {
        setSearchError('Invalid input. Enter a transaction hash (0x... 66 chars) or address (0x... 42 chars)');
      }
    } catch (err) {
      setSearchError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div className="min-h-screen bg-deep-space relative">
      {/* Stars background */}
      <div className="stars" />

      <Navbar />
      <main className="container-custom py-24 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-horizon">🔭 Block Explorer</span>
          </h1>
          <p className="text-starlight/70 text-lg">
            Explore blocks, transactions, and addresses on the <span className="text-horizon-blue">Axionax</span> testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-orange">⬡ Latest Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-horizon-gold mb-2">
                {isLoading
                  ? '...'
                  : `#${blocksData?.blocks[0]?.number.toLocaleString() || '0'}`}
              </div>
              <div className="text-sm text-starlight/50">
                {isLoading
                  ? 'Loading...'
                  : blocksData?.blocks[0]
                    ? formatTimestamp(blocksData.blocks[0].timestamp)
                    : 'N/A'}
              </div>
            </CardContent>
          </div>

          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-purple">📊 Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-horizon-blue mb-2">
                {isLoading ? '...' : blocksData?.total.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-starlight/50">Since testnet launch</div>
            </CardContent>
          </div>

          <div className="card-cosmic hover:shadow-horizon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-horizon-pink">
                ⚡ Active Validators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">2/2</div>
              <div className="text-sm text-starlight/50">EU + AU regions</div>
            </CardContent>
          </div>
        </div>

        {/* Search Section */}
        <div className="card-cosmic mb-8">
          <CardHeader>
            <CardTitle className="text-horizon-blue">🔍 Search the Cosmos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by address (0x...) or transaction hash..."
                className="flex-1 px-4 py-3 bg-void border border-horizon-purple/30 rounded-lg text-starlight placeholder-starlight/30 focus:outline-none focus:border-horizon-orange focus:shadow-horizon-sm font-mono text-sm transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="btn-horizon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? '🔄 Searching...' : '🚀 Search'}
              </button>
            </div>

            {searchError && (
              <div className="mt-4 p-4 bg-horizon-pink/10 border border-horizon-pink/30 rounded-lg text-horizon-pink">
                ❌ {searchError}
              </div>
            )}

            {searchResult && searchType === 'address' && (
              <div className="mt-4 p-6 bg-void rounded-lg border border-horizon-purple/30">
                <h3 className="text-lg font-semibold text-horizon-gold mb-4">📍 Address Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-starlight/50">Address:</span>
                    <span className="ml-2 font-mono text-starlight break-all">{searchResult.address}</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">Balance:</span>
                    <span className="ml-2 font-bold text-horizon-gold">{searchResult.balance} AXX</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">Nonce:</span>
                    <span className="ml-2 text-starlight">{searchResult.nonce}</span>
                  </div>
                </div>
              </div>
            )}

            {searchResult && searchType === 'tx' && (
              <div className="mt-4 p-6 bg-void rounded-lg border border-horizon-purple/30">
                <h3 className="text-lg font-semibold text-horizon-blue mb-4">📜 Transaction Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-starlight/50">Hash:</span>
                    <span className="ml-2 font-mono text-starlight break-all">{searchResult.hash}</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">Block:</span>
                    <span className="ml-2 text-horizon-purple">#{parseInt(searchResult.blockNumber, 16).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">From:</span>
                    <span className="ml-2 font-mono text-starlight break-all">{searchResult.from}</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">To:</span>
                    <span className="ml-2 font-mono text-starlight break-all">{searchResult.to || 'Contract Creation'}</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">Value:</span>
                    <span className="ml-2 font-bold text-horizon-gold">{(parseInt(searchResult.value, 16) / 1e18).toFixed(4)} AXX</span>
                  </div>
                  <div>
                    <span className="text-starlight/50">Gas:</span>
                    <span className="ml-2 text-starlight">{parseInt(searchResult.gas, 16).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        <div className="card-cosmic">
          <CardHeader>
            <CardTitle className="text-horizon">⬡ Recent Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-starlight/50">
                <div className="loading-spinner w-8 h-8 mx-auto mb-2"></div>
                Loading blocks from the cosmos...
              </div>
            ) : blocksData?.blocks && blocksData.blocks.length > 0 ? (
              <div className="space-y-3">
                {blocksData.blocks.map((block) => (
                  <div
                    key={block.number}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-void rounded-lg border border-horizon-purple/20 hover:border-horizon-orange/50 hover:shadow-horizon-sm transition-all duration-300 gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-horizon-orange font-mono text-lg">
                        #{block.number.toLocaleString()}
                      </div>
                      <div className="text-starlight/50 text-sm">
                        {formatTimestamp(block.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-starlight/40">Txs:</span>{' '}
                        <span className="text-horizon-blue">{block.txCount}</span>
                      </div>
                      <div>
                        <span className="text-starlight/40">Gas:</span>{' '}
                        <span className="text-horizon-purple">
                          {(parseInt(block.gasUsed) / 1_000_000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="hidden md:block font-mono text-xs text-starlight/30">
                        {block.hash.slice(0, 10)}...{block.hash.slice(-8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-starlight/50">
                No blocks found in this dimension
              </div>
            )}
          </CardContent>
        </div>

        <div className="mt-8 text-center">
          <p className="text-starlight/40 text-sm">
            🌌 Explorer connected to live validators (EU + AU). Search for addresses or transactions above.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
