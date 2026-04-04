/**
 * Network configuration for Axionax SDK
 */

import {
  CHAIN_IDS,
  RPC_URLS,
  EXPLORER_URLS,
  AXX_TOKEN,
  AXXT_TOKEN,
} from '@axionax/blockchain-utils';

// ============================================
// Testnet Configuration
// ============================================

export const AXIONAX_TESTNET_CONFIG = {
  chainId: `0x${CHAIN_IDS.TESTNET.toString(16)}`,
  chainIdDecimal: CHAIN_IDS.TESTNET,
  chainName: 'Axionax Testnet',
  nativeCurrency: {
    name: AXXT_TOKEN.name,
    symbol: AXXT_TOKEN.symbol,
    decimals: AXXT_TOKEN.decimals,
  },
  rpcUrls: RPC_URLS.TESTNET,
  blockExplorerUrls: [EXPLORER_URLS.TESTNET],
} as const;

// ============================================
// Mainnet Configuration (Planned)
// ============================================

export const AXIONAX_MAINNET_CONFIG = {
  chainId: `0x${CHAIN_IDS.MAINNET.toString(16)}`,
  chainIdDecimal: CHAIN_IDS.MAINNET,
  chainName: 'Axionax Mainnet',
  nativeCurrency: {
    name: AXX_TOKEN.name,
    symbol: AXX_TOKEN.symbol,
    decimals: AXX_TOKEN.decimals,
  },
  rpcUrls: RPC_URLS.MAINNET.length > 0 ? RPC_URLS.MAINNET : ['https://mainnet.rpc.axionax.org'],
  blockExplorerUrls: [EXPLORER_URLS.MAINNET],
} as const;

// ============================================
// Default Configuration
// ============================================

function resolveConfiguredChainId(): number {
  const envChainId =
    process.env.AXIONAX_SDK_CHAIN_ID ??
    process.env.AXIONAX_CHAIN_ID ??
    process.env.NEXT_PUBLIC_CHAIN_ID;

  if (envChainId) {
    const parsed = Number(envChainId);
    if (parsed === CHAIN_IDS.MAINNET || parsed === CHAIN_IDS.TESTNET) {
      return parsed;
    }
  }

  const envNetwork =
    process.env.AXIONAX_SDK_NETWORK ??
    process.env.AXIONAX_NETWORK ??
    process.env.RPC_NETWORK;

  if (envNetwork?.toLowerCase() === 'mainnet') {
    return CHAIN_IDS.MAINNET;
  }

  return CHAIN_IDS.TESTNET;
}

export const DEFAULT_CHAIN_ID = resolveConfiguredChainId();

export const DEFAULT_CONFIG =
  DEFAULT_CHAIN_ID === CHAIN_IDS.MAINNET
    ? AXIONAX_MAINNET_CONFIG
    : AXIONAX_TESTNET_CONFIG;

export const ACTIVE_NETWORK_CONFIG = DEFAULT_CONFIG;
export const getDefaultNetworkConfig = () => DEFAULT_CONFIG;
export const getDefaultConfig = () => DEFAULT_CONFIG;

// ============================================
// Contract Addresses
// ============================================

export const CONTRACTS = {
  TESTNET: {
    ESCROW: '0x0000000000000000000000000000000000002000',
    JOB_REGISTRY: '0x0000000000000000000000000000000000002001',
    WORKER_REGISTRY: '0x0000000000000000000000000000000000002002',
  },
  MAINNET: {
    ESCROW: '0x0000000000000000000000000000000000002000',
    JOB_REGISTRY: '0x0000000000000000000000000000000000002001',
    WORKER_REGISTRY: '0x0000000000000000000000000000000000002002',
  },
} as const;
