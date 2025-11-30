import {
  AXIONAX_TESTNET_CONFIG,
  isMetaMaskInstalled as sdkIsMetaMaskInstalled,
  connectWallet as sdkConnectWallet,
  getCurrentAccount as sdkGetCurrentAccount,
  getBalance as sdkGetBalance,
  getCurrentChainId as sdkGetCurrentChainId,
  formatAddress as sdkFormatAddress,
  MetaMaskError as SdkMetaMaskError,
} from '@axionax/sdk';

// Re-export constants with original name for backward compatibility
export const AXIONAX_TESTNET = AXIONAX_TESTNET_CONFIG;

export type MetaMaskError = SdkMetaMaskError;

export const isMetaMaskInstalled = sdkIsMetaMaskInstalled;
export const connectWallet = sdkConnectWallet;
export const getCurrentAccount = sdkGetCurrentAccount;
export const getBalance = sdkGetBalance;
export const getCurrentChainId = sdkGetCurrentChainId;
export const formatAddress = sdkFormatAddress;
