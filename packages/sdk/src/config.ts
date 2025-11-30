/**
 * Axionax Network Configuration
 */

export const AXIONAX_TESTNET_CHAIN_ID = 86137;
export const AXIONAX_TESTNET_CHAIN_ID_HEX = '0x1508d';

export const DEFAULT_RPC_URLS = [
  'https://axionax.org/rpc/', // Proxy to EU Validator (SSL)
  'http://217.76.61.116:8545', // Direct EU Validator
  'http://46.250.244.4:8545', // Direct AU Validator
];

export const BLOCK_EXPLORER_URLS = ['https://axionax.org/api/'];

export const AXIONAX_TESTNET_CONFIG = {
  chainId: AXIONAX_TESTNET_CHAIN_ID_HEX,
  chainIdDecimal: AXIONAX_TESTNET_CHAIN_ID,
  chainName: 'axionax Testnet',
  nativeCurrency: {
    name: 'AXX',
    symbol: 'AXX',
    decimals: 18,
  },
  rpcUrls: process.env.NEXT_PUBLIC_RPC_URL 
    ? [process.env.NEXT_PUBLIC_RPC_URL, ...DEFAULT_RPC_URLS]
    : DEFAULT_RPC_URLS,
  blockExplorerUrls: BLOCK_EXPLORER_URLS,
};

export const ESCROW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Replace with actual address
