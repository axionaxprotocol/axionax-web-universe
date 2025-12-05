import { NextRequest, NextResponse } from 'next/server';
import { moderateRateLimit } from '@/lib/rateLimit';
import { ethers } from 'ethers';

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
}

// Use EU validator as primary RPC endpoint
const RPC_URL = process.env.RPC_URL || 'http://217.76.61.116:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function getBlock(blockNumber: number): Promise<Block | null> {
  try {
    const block = await provider.getBlock(blockNumber);
    if (!block) return null;

    return {
      number: block.number,
      hash: block.hash || '',
      timestamp: block.timestamp * 1000, // Convert to ms
      transactions: block.transactions.length,
      miner: block.miner,
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
    };
  } catch (error) {
    console.error(`Failed to fetch block ${blockNumber}:`, error);
    return null;
  }
}

async function getCurrentBlockNumber(): Promise<number> {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error('Failed to fetch block number:', error);
    return 0;
  }
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

    // Fetch blocks for the requested page
    const startBlock = currentBlock - (page - 1) * pageSize;
    const blockPromises: Promise<Block | null>[] = [];

    for (let i = 0; i < pageSize && startBlock - i >= 0; i++) {
      blockPromises.push(getBlock(startBlock - i));
    }

    const fetchedBlocks = await Promise.all(blockPromises);
    const blocks = fetchedBlocks.filter((b): b is Block => b !== null);

    const response: BlocksResponse = {
      blocks,
      total: currentBlock,
      page,
      pageSize,
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
