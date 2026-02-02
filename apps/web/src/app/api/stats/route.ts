import { NextResponse } from 'next/server';

// RPC endpoints for validators
const RPC_ENDPOINTS = {
  eu: process.env.RPC_EU_URL || 'http://217.76.61.116:8545',
  au: process.env.RPC_AU_URL || 'http://46.250.244.4:8545',
};

interface StatsResponse {
  blockNumber: number;
  services: {
    healthy: number;
  };
  uptime: {
    hours: number;
  };
  deployment: number;
  validators: {
    online: number;
  };
}

async function getBlockNumber(rpcUrl: string): Promise<number | null> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return parseInt(data.result, 16);
  } catch {
    return null;
  }
}

async function checkValidatorHealth(rpcUrl: string): Promise<boolean> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'net_version',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    // Check validator health in parallel
    const [euHealth, auHealth] = await Promise.all([
      checkValidatorHealth(RPC_ENDPOINTS.eu),
      checkValidatorHealth(RPC_ENDPOINTS.au),
    ]);

    // Get block number from healthy validator
    let blockNumber = 0;
    if (euHealth) {
      const euBlock = await getBlockNumber(RPC_ENDPOINTS.eu);
      if (euBlock) blockNumber = euBlock;
    } else if (auHealth) {
      const auBlock = await getBlockNumber(RPC_ENDPOINTS.au);
      if (auBlock) blockNumber = auBlock;
    }

    const validatorsOnline = (euHealth ? 1 : 0) + (auHealth ? 1 : 0);

    const stats: StatsResponse = {
      blockNumber,
      services: {
        healthy: validatorsOnline > 0 ? 9 : 0,
      },
      uptime: {
        hours: 48, // Placeholder - could be calculated from deployment time
      },
      deployment: 100,
      validators: {
        online: validatorsOnline,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);

    // Return mock data on error
    return NextResponse.json({
      blockNumber: 0,
      services: { healthy: 0 },
      uptime: { hours: 0 },
      deployment: 100,
      validators: { online: 0 },
    });
  }
}
