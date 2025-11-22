'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

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

const fetchBlocks = async (): Promise<BlocksResponse> => {
  const response = await fetch('/api/blocks?page=1&pageSize=10');
  if (!response.ok) throw new Error('Failed to fetch blocks');
  return (await response.json()) as BlocksResponse;
};

const formatTimestamp = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function Explorer(): React.JSX.Element {
  const { data: blocksData, isLoading } = useQuery<BlocksResponse>({
    queryKey: ['blocks'],
    queryFn: fetchBlocks,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
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
            Full explorer functionality coming soon. This is a preview
            interface.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
