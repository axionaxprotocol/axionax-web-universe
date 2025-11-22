// axionax Testnet Configuration
export const AXIONAX_TESTNET = {
  chainId: '0x1508d', // 86137 in hex
  chainIdDecimal: 86137,
  chainName: 'axionax Testnet',
  nativeCurrency: {
    name: 'AXX',
    symbol: 'AXX',
    decimals: 18,
  },
  rpcUrls: [
    'https://axionax.org/rpc/', // Proxy to EU Validator (SSL)
    'http://217.76.61.116:8545', // Direct EU Validator
    'http://46.250.244.4:8545', // Direct AU Validator
  ],
  blockExplorerUrls: ['https://axionax.org/api/'],
};

export interface MetaMaskError extends Error {
  code: number;
  message: string;
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window as unknown as {
    ethereum?: { isMetaMask?: boolean };
  };
  return Boolean(ethereum && ethereum.isMetaMask);
};

// Request account access
export const connectWallet = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error(
      'MetaMask is not installed. Please install it to continue.'
    );
  }

  const { ethereum } = window as unknown as {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  };

  try {
    // Request account access
    const accounts = (await ethereum?.request({
      method: 'eth_requestAccounts',
    })) as string[];

    // Try to switch to axionax Testnet
    try {
      await ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AXIONAX_TESTNET.chainId }],
      });
    } catch (switchError: unknown) {
      // Chain not added yet, add it
      const error = switchError as { code?: number };
      if (error.code === 4902) {
        await ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: AXIONAX_TESTNET.chainId,
              chainName: AXIONAX_TESTNET.chainName,
              nativeCurrency: AXIONAX_TESTNET.nativeCurrency,
              rpcUrls: AXIONAX_TESTNET.rpcUrls,
              blockExplorerUrls: AXIONAX_TESTNET.blockExplorerUrls,
            },
          ],
        });
      } else {
        throw switchError;
      }
    }

    return accounts;
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;

  const { ethereum } = window as unknown as {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  };

  try {
    const accounts = (await ethereum?.request({
      method: 'eth_accounts',
    })) as string[];
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Get balance
export const getBalance = async (address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) return '0';

  const { ethereum } = window as unknown as {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  };

  try {
    const balance = (await ethereum?.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    })) as string;
    // Convert from wei to AXX
    return (parseInt(balance, 16) / 1e18).toFixed(4);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Get current chain ID
export const getCurrentChainId = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;

  const { ethereum } = window as unknown as {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  };

  try {
    const chainId = (await ethereum?.request({
      method: 'eth_chainId',
    })) as string;
    return chainId;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
