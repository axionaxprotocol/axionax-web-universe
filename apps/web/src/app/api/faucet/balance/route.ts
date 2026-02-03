import { NextResponse } from 'next/server';

const FAUCET_API_URL = process.env.FAUCET_API_URL || 'http://localhost:3002';

export async function GET() {
  try {
    const res = await fetch(`${FAUCET_API_URL}/balance`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        address: data.address || '0x0',
        balance: String(data.balance ?? data.balanceWei ?? '0'),
        symbol: data.symbol || 'AXX',
        isMock: false,
      });
    }
  } catch {
    // Fallback: mock balance when faucet-api is not running
  }
  return NextResponse.json({
    address: '0x0000000000000000000000000000000000000000',
    balance: '1000000',
    symbol: 'AXX',
    isMock: true,
  });
}
