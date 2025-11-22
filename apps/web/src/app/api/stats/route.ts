import { NextRequest, NextResponse } from 'next/server';
import { moderateRateLimit } from '@/lib/rateLimit';
import { ethers } from 'ethers';

interface StatsResponse {
  blockNumber: number;
  services: {
    healthy: number;
    total: number;
  };
  uptime: {
    hours: number;
    days: number;
  };
  deployment: number;
  validators: {
    online: number;
    total: number;
  };
  timestamp: number;
}

// Calculate uptime since testnet launch (Nov 18, 2025)
const LAUNCH_DATE = new Date('2025-11-18T00:00:00Z').getTime();
const RPC_URL = process.env.RPC_URL || 'http://217.216.109.5:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function getBlockHeight(): Promise<number> {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error('Failed to fetch block height:', error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = moderateRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const blockNumber = await getBlockHeight();
    const now = Date.now();
    const uptimeMs = now - LAUNCH_DATE;
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeDays = Math.floor(uptimeHours / 24);

    const stats: StatsResponse = {
      blockNumber: blockNumber > 0 ? blockNumber : 0,
      services: {
        healthy: 7,
        total: 9,
      },
      uptime: {
        hours: uptimeHours,
        days: uptimeDays,
      },
      deployment: 100,
      validators: {
        online: 2,
        total: 2,
      },
      timestamp: now,
    };

    return NextResponse.json(stats, {
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
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
