'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: number;
  miner: string;
  gasUsed: string;
  gasLimit: string;
}

interface BlocksResponse {
  blocks: Block[];
  total: number;
  page: number;
  pageSize: number;
}

interface AddressInfo {
  address: string;
  balance: string;
  nonce: number;
}

const RPC_URL = 'https://rpc.axionax.org';

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
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="container-custom py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Block Explorer
          </h1>
          <p className="text-dark-400 text-lg">
            Explore blocks, transactions, and addresses on the axionax testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400">Latest Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {isLoading
                  ? '...'
                  : `#${blocksData?.blocks[0]?.number.toLocaleString() || '0'}`}
              </div>
              <div className="text-sm text-dark-400">
                {isLoading
                  ? 'Loading...'
                  : blocksData?.blocks[0]
                    ? formatTimestamp(blocksData.blocks[0].timestamp)
                    : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400">Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {isLoading ? '...' : blocksData?.total.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-dark-400">Since testnet launch</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-400">
                Active Validators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">2/2</div>
              <div className="text-sm text-dark-400">EU + AU regions</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-primary-400">🔍 Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by address (0x...) or transaction hash..."
                className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 font-mono text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {searchError && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                {searchError}
              </div>
            )}
            
            {searchResult && searchType === 'address' && (
              <div className="mt-4 p-6 bg-dark-900 rounded-lg border border-dark-700">
                <h3 className="text-lg font-semibold text-primary-400 mb-4">Address Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-dark-400">Address:</span>
                    <span className="ml-2 font-mono text-white break-all">{searchResult.address}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Balance:</span>
                    <span className="ml-2 font-bold text-green-400">{searchResult.balance} AXX</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Nonce:</span>
                    <span className="ml-2 text-white">{searchResult.nonce}</span>
                  </div>
                </div>
              </div>
            )}
            
            {searchResult && searchType === 'tx' && (
              <div className="mt-4 p-6 bg-dark-900 rounded-lg border border-dark-700">
                <h3 className="text-lg font-semibold text-primary-400 mb-4">Transaction Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-dark-400">Hash:</span>
                    <span className="ml-2 font-mono text-white break-all">{searchResult.hash}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Block:</span>
                    <span className="ml-2 text-white">#{parseInt(searchResult.blockNumber, 16).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">From:</span>
                    <span className="ml-2 font-mono text-white break-all">{searchResult.from}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">To:</span>
                    <span className="ml-2 font-mono text-white break-all">{searchResult.to || 'Contract Creation'}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Value:</span>
                    <span className="ml-2 font-bold text-green-400">{(parseInt(searchResult.value, 16) / 1e18).toFixed(4)} AXX</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Gas:</span>
                    <span className="ml-2 text-white">{parseInt(searchResult.gas, 16).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-dark-400">
                Loading blocks...
              </div>
            ) : blocksData?.blocks && blocksData.blocks.length > 0 ? (
              <div className="space-y-4">
                {blocksData.blocks.map((block) => (
                  <div
                    key={block.number}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-dark-900 rounded-lg border border-dark-800 hover:border-primary-500/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-primary-400 font-mono text-lg">
                        #{block.number.toLocaleString()}
                      </div>
                      <div className="text-dark-400 text-sm">
                        {formatTimestamp(block.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-dark-500">Txs:</span>{' '}
                        <span className="text-white">{block.transactions}</span>
                      </div>
                      <div>
                        <span className="text-dark-500">Gas:</span>{' '}
                        <span className="text-white">
                          {(parseInt(block.gasUsed) / 1_000_000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="hidden md:block font-mono text-xs text-dark-500">
                        {block.hash.slice(0, 10)}...{block.hash.slice(-8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-400">
                No blocks found
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-dark-500 text-sm">
            Explorer connected to live validators (EU + AU). Search for addresses or transactions above.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
