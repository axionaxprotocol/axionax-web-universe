import { NextRequest, NextResponse } from 'next/server';
import { moderateRateLimit } from '@/lib/rateLimit';
import { ethers } from 'ethers';

// Force dynamic rendering - skip static export
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    latency: {
      eu: number;
      au: number;
    };
  };
  chainId: number;
  timestamp: number;
}

// Calculate uptime since testnet launch (Nov 18, 2025)
const LAUNCH_DATE = new Date('2025-11-18T00:00:00Z').getTime();
const CHAIN_ID = 86137;
const CHAIN_NAME = 'axionax-testnet';

// RPC endpoints (EU primary, AU backup)
const RPC_ENDPOINTS = {
  eu: process.env.RPC_URL_EU || 'http://217.76.61.116:8545',
  au: process.env.RPC_URL_AU || 'http://46.250.244.4:8545',
};

// Create providers with static network to avoid auto-detection issues
const axionaxNetwork = new ethers.Network(CHAIN_NAME, CHAIN_ID);

function createProvider(url: string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(url, axionaxNetwork, { staticNetwork: axionaxNetwork });
}

interface ValidatorStatus {
  online: boolean;
  blockNumber: number;
  latency: number;
}

async function checkValidator(url: string): Promise<ValidatorStatus> {
  const start = Date.now();
  try {
    const provider = createProvider(url);
    const blockNumber = await provider.getBlockNumber();
    const latency = Date.now() - start;
    return { online: true, blockNumber, latency };
  } catch (error) {
    return { online: false, blockNumber: 0, latency: -1 };
  }
}

async function getValidatorStats(): Promise<{
  online: number;
  total: number;
  blockNumber: number;
  latency: { eu: number; au: number };
}> {
  const [euStatus, auStatus] = await Promise.all([
    checkValidator(RPC_ENDPOINTS.eu),
    checkValidator(RPC_ENDPOINTS.au),
  ]);

  const online = (euStatus.online ? 1 : 0) + (auStatus.online ? 1 : 0);
  const blockNumber = Math.max(euStatus.blockNumber, auStatus.blockNumber);

  return {
    online,
    total: 2,
    blockNumber,
    latency: {
      eu: euStatus.latency,
      au: auStatus.latency,
    },
  };
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = moderateRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const validatorStats = await getValidatorStats();
    const now = Date.now();
    const uptimeMs = now - LAUNCH_DATE;
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeDays = Math.floor(uptimeHours / 24);

    const stats: StatsResponse = {
      blockNumber: validatorStats.blockNumber,
      services: {
        healthy: 9, // Updated count with all services
        total: 11,
      },
      uptime: {
        hours: uptimeHours,
        days: uptimeDays,
      },
      deployment: 100,
      validators: {
        online: validatorStats.online,
        total: validatorStats.total,
        latency: validatorStats.latency,
      },
      chainId: CHAIN_ID,
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
