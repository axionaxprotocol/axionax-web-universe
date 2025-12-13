/**
 * Web3 utilities for axionax frontend
 * 
 * Re-exports wallet utilities from @axionax/blockchain-utils
 * for backward compatibility.
 * 
 * @deprecated Import directly from '@axionax/blockchain-utils' instead
 */

// Re-export everything from blockchain-utils wallet
export {
  // Provider
  getProvider,
  isMetaMaskInstalled,
  isWalletAvailable,

  // Accounts
  connectWallet,
  getAccounts,
  getCurrentAccount,

  // Chain
  getChainId as getCurrentChainId,
  switchChain,
  addChain,
  connectToAxionax,

  // Balance
  getBalance,
  getTransactionCount,

  // Token
  addToken as addTokenToMetaMask,

  // Events
  onAccountsChanged,
  onChainChanged,

  // Types
  type EIP1193Provider,
  type WalletError,
  type AddTokenParams,
  WALLET_ERROR_CODES,
} from '@axionax/blockchain-utils';

// Re-export chain config for backward compatibility
export {
  axionaxTestnet as AXIONAX_TESTNET_CONFIG,
  getMetaMaskNetworkParams,
  CHAIN_IDS,
  RPC_URLS,
  EXPLORER_URLS,
  formatAddress,
  formatUnits,
} from '@axionax/blockchain-utils';

// Legacy AXIONAX_TESTNET object for backward compatibility
import { axionaxTestnet, CHAIN_IDS, RPC_URLS, EXPLORER_URLS } from '@axionax/blockchain-utils';

export const AXIONAX_TESTNET = {
  chainId: '0x' + CHAIN_IDS.TESTNET.toString(16),
  chainIdDecimal: CHAIN_IDS.TESTNET,
  chainName: axionaxTestnet.name,
  nativeCurrency: axionaxTestnet.nativeCurrency,
  rpcUrls: RPC_URLS.TESTNET,
  blockExplorerUrls: [EXPLORER_URLS.TESTNET],
};

// Legacy error type
export interface MetaMaskError extends Error {
  code: number;
  message: string;
}

// Legacy addAXXToken function
export async function addAXXToken(tokenAddress: string): Promise<boolean> {
  const { addToken } = await import('@axionax/blockchain-utils');
  return addToken({
    address: tokenAddress,
    symbol: 'AXX',
    decimals: 18,
  });
}
