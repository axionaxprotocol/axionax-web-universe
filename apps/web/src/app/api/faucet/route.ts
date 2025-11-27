import { NextRequest, NextResponse } from 'next/server';
import { strictRateLimit } from '@/lib/rateLimit';
import { ethers } from 'ethers';

interface FaucetRequest {
  address: string;
}

interface FaucetResponse {
  success: boolean;
  message: string;
  txHash?: string;
  amount?: string;
  cooldown?: number;
}

// Simple in-memory rate limiting (will be replaced with Redis in production)
const requestLog = new Map<string, number>();
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const FAUCET_AMOUNT = '10'; // 10 AXX
const RPC_URL = process.env.RPC_URL || 'http://217.216.109.5:8545';
const PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;

// Validate Ethereum address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Check if address is in cooldown
function isInCooldown(address: string): {
  inCooldown: boolean;
  remainingMs?: number;
} {
  const lastRequest = requestLog.get(address.toLowerCase());
  if (!lastRequest) return { inCooldown: false };

  const elapsed = Date.now() - lastRequest;
  if (elapsed < COOLDOWN_MS) {
    return {
      inCooldown: true,
      remainingMs: COOLDOWN_MS - elapsed,
    };
  }

  return { inCooldown: false };
}

// Real function to send tokens
async function sendTokens(address: string): Promise<string> {
  if (!PRIVATE_KEY) {
    throw new Error('Faucet private key is not configured on the server.');
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Create transaction
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(FAUCET_AMOUNT),
    });

    // Wait for transaction to be mined (optional, but good for confirmation)
    // await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error('Faucet transaction failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = strictRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: FaucetRequest = await request.json();
    const { address } = body;

    // Validate address
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }

    if (!isValidAddress(address)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Check cooldown
    const cooldownCheck = isInCooldown(address);
    if (cooldownCheck.inCooldown && cooldownCheck.remainingMs) {
      const remainingHours = Math.ceil(
        cooldownCheck.remainingMs / (1000 * 60 * 60)
      );
      return NextResponse.json(
        {
          success: false,
          message: `Address is in cooldown. Please try again in ${remainingHours} hours.`,
          cooldown: cooldownCheck.remainingMs,
        },
        { status: 429 }
      );
    }

    // Send tokens
    try {
      const txHash = await sendTokens(address);

      // Update request log
      requestLog.set(address.toLowerCase(), Date.now());

      const response: FaucetResponse = {
        success: true,
        message: `Successfully sent ${FAUCET_AMOUNT} AXX to ${address.slice(0, 6)}...${address.slice(-4)}`,
        txHash,
        amount: FAUCET_AMOUNT,
      };

      return NextResponse.json(response, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (error) {
      console.error('Failed to send tokens:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send tokens. Please try again later.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Faucet API error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

// GET endpoint to check faucet status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (address && isValidAddress(address)) {
    const cooldownCheck = isInCooldown(address);

    return NextResponse.json({
      address,
      canClaim: !cooldownCheck.inCooldown,
      cooldownRemaining: cooldownCheck.remainingMs || 0,
      amount: FAUCET_AMOUNT,
    });
  }

  return NextResponse.json({
    status: 'online',
    amount: FAUCET_AMOUNT,
    cooldown: COOLDOWN_MS,
    network: 'Axionax Testnet',
    chainId: 86137,
  });
}
