import { NextRequest, NextResponse } from 'next/server';
import { moderateRateLimit } from '@/lib/rateLimit';

// Force dynamic rendering - skip static export
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
  note?: string;
}

// Use EU validator as primary RPC endpoint
const RPC_URL = process.env.RPC_URL || 'http://217.76.61.116:8545';

// Raw JSON-RPC call (validator node is a light node with limited methods)
async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.result;
}

async function getCurrentBlockNumber(): Promise<number> {
  try {
    const result = await rpcCall('eth_blockNumber');
    return parseInt(result as string, 16);
  } catch (error) {
    console.error('Failed to fetch block number:', error);
    return 0;
  }
}

// Generate synthetic block data (validator node doesn't have eth_getBlockByNumber)
function generateBlockPlaceholder(blockNumber: number): Block {
  // Estimate timestamp based on 2 second block time from genesis
  const GENESIS_TIMESTAMP = 1731319200000; // Approximate testnet genesis
  const BLOCK_TIME_MS = 2000;
  const estimatedTimestamp = GENESIS_TIMESTAMP + blockNumber * BLOCK_TIME_MS;

  return {
    number: blockNumber,
    hash: `0x${blockNumber.toString(16).padStart(64, '0')}`, // Placeholder hash
    timestamp: estimatedTimestamp,
    transactions: 0,
    miner: '0x0000000000000000000000000000000000000000',
    gasUsed: '0',
    gasLimit: '30000000',
  };
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = moderateRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const currentBlock = await getCurrentBlockNumber();

    if (currentBlock === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch chain data' },
        { status: 500 }
      );
    }

    // Generate placeholder blocks (validator is light node without eth_getBlockByNumber)
    const startBlock = currentBlock - (page - 1) * pageSize;
    const blocks: Block[] = [];

    for (let i = 0; i < pageSize && startBlock - i >= 0; i++) {
      blocks.push(generateBlockPlaceholder(startBlock - i));
    }

    const response: BlocksResponse = {
      blocks,
      total: currentBlock,
      page,
      pageSize,
      note: 'Block details limited - validator running in light mode',
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
}
