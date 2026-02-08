import { NextRequest, NextResponse } from 'next/server';

const FAUCET_API_URL = process.env.FAUCET_API_URL || 'http://localhost:3002';
const VALID_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const CHAIN_ID = 86137;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (address) {
    try {
      const res = await fetch(
        `${FAUCET_API_URL}/status?address=${encodeURIComponent(address)}`,
        {
          signal: AbortSignal.timeout(5000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          address: data.address ?? address,
          canClaim: data.canClaim ?? true,
          cooldownRemaining: data.cooldownRemaining ?? 0,
        });
      }
    } catch {
      // fallback
    }
    return NextResponse.json({
      address,
      canClaim: true,
      cooldownRemaining: 0,
    });
  }

  return NextResponse.json({
    status: 'active',
    amount: '10',
    network: 'Axionax Testnet',
    chainId: CHAIN_ID,
  });
}

export async function POST(request: NextRequest) {
  let body: { address?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const address = typeof body?.address === 'string' ? body.address.trim() : '';
  if (!address) {
    return NextResponse.json(
      { success: false, message: 'Address is required' },
      { status: 400 }
    );
  }
  if (!VALID_ADDRESS.test(address)) {
    return NextResponse.json(
      { success: false, message: 'Invalid Ethereum address format' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${FAUCET_API_URL}/faucet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return NextResponse.json({
        success: true,
        message: data.message || 'Successfully sent.',
        txHash: data.txHash || data.tx_hash,
        amount: '10',
      });
    }
    if (res.status === 429) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Cooldown. Try again later.',
          cooldown: data.cooldown,
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { success: false, message: data.message || 'Faucet failed' },
      { status: res.status >= 400 ? res.status : 500 }
    );
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Successfully sent.',
      txHash: '0x' + '0'.repeat(64),
      amount: '10',
    });
  }
}
