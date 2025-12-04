/**
 * axionax SDK v2.0 - Gas Utilities
 * Gas estimation, optimization, and EIP-1559 support
 */

import { ethers } from 'ethers';

// ============ Types ============

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;          // Legacy
  maxFeePerGas: bigint;      // EIP-1559
  maxPriorityFeePerGas: bigint; // EIP-1559
  estimatedCost: bigint;     // In wei
  estimatedCostAXX: string;  // Formatted
}

export interface GasPriceHistory {
  blockNumber: number;
  baseFee: bigint;
  timestamp: number;
}

export type GasSpeed = 'slow' | 'standard' | 'fast' | 'instant';

export interface GasSpeedConfig {
  priorityFeeMultiplier: number;
  maxFeeMultiplier: number;
  estimatedWait: string;
}

// ============ Constants ============

export const GAS_SPEED_CONFIG: Record<GasSpeed, GasSpeedConfig> = {
  slow: {
    priorityFeeMultiplier: 0.8,
    maxFeeMultiplier: 1.0,
    estimatedWait: '~5 minutes'
  },
  standard: {
    priorityFeeMultiplier: 1.0,
    maxFeeMultiplier: 1.2,
    estimatedWait: '~1 minute'
  },
  fast: {
    priorityFeeMultiplier: 1.5,
    maxFeeMultiplier: 1.5,
    estimatedWait: '~30 seconds'
  },
  instant: {
    priorityFeeMultiplier: 2.0,
    maxFeeMultiplier: 2.0,
    estimatedWait: '~10 seconds'
  }
};

// Default gas limits for common operations
export const DEFAULT_GAS_LIMITS = {
  transfer: 21000n,
  erc20Transfer: 65000n,
  erc20Approve: 46000n,
  stake: 150000n,
  unstake: 100000n,
  claimRewards: 80000n,
  depositEscrow: 120000n,
  releaseEscrow: 80000n,
  vote: 100000n,
  propose: 200000n,
  deployContract: 500000n
};

// ============ Gas Estimator Class ============

export class GasEstimator {
  private provider: ethers.Provider;
  private priceHistory: GasPriceHistory[] = [];
  private maxHistorySize: number = 100;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  /**
   * Get current gas prices with EIP-1559 support
   */
  async getGasPrices(speed: GasSpeed = 'standard'): Promise<{
    gasPrice: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    baseFee: bigint;
  }> {
    const feeData = await this.provider.getFeeData();
    const config = GAS_SPEED_CONFIG[speed];

    const baseFee = feeData.maxFeePerGas 
      ? feeData.maxFeePerGas - (feeData.maxPriorityFeePerGas || 0n)
      : feeData.gasPrice || 1000000000n;

    const priorityFee = BigInt(
      Math.floor(Number(feeData.maxPriorityFeePerGas || 1000000000n) * config.priorityFeeMultiplier)
    );

    const maxFee = BigInt(
      Math.floor(Number(baseFee + priorityFee) * config.maxFeeMultiplier)
    );

    return {
      gasPrice: feeData.gasPrice || 1000000000n,
      maxFeePerGas: maxFee,
      maxPriorityFeePerGas: priorityFee,
      baseFee
    };
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    tx: ethers.TransactionRequest,
    speed: GasSpeed = 'standard'
  ): Promise<GasEstimate> {
    // Get gas limit
    let gasLimit: bigint;
    try {
      gasLimit = await this.provider.estimateGas(tx);
      // Add 20% buffer for safety
      gasLimit = gasLimit + (gasLimit * 20n / 100n);
    } catch (e) {
      // Use default if estimation fails
      gasLimit = DEFAULT_GAS_LIMITS.transfer;
    }

    // Get gas prices
    const prices = await this.getGasPrices(speed);

    // Calculate estimated cost
    const estimatedCost = gasLimit * prices.maxFeePerGas;

    return {
      gasLimit,
      gasPrice: prices.gasPrice,
      maxFeePerGas: prices.maxFeePerGas,
      maxPriorityFeePerGas: prices.maxPriorityFeePerGas,
      estimatedCost,
      estimatedCostAXX: ethers.formatEther(estimatedCost)
    };
  }

  /**
   * Estimate gas for contract method call
   */
  async estimateContractGas(
    contract: ethers.Contract,
    method: string,
    args: unknown[],
    options: { value?: bigint; speed?: GasSpeed } = {}
  ): Promise<GasEstimate> {
    const { value = 0n, speed = 'standard' } = options;

    // Estimate gas using contract method
    let gasLimit: bigint;
    try {
      gasLimit = await contract[method].estimateGas(...args, { value });
      gasLimit = gasLimit + (gasLimit * 20n / 100n);
    } catch (e) {
      // Return high estimate if fails
      gasLimit = 500000n;
    }

    const prices = await this.getGasPrices(speed);
    const estimatedCost = gasLimit * prices.maxFeePerGas;

    return {
      gasLimit,
      gasPrice: prices.gasPrice,
      maxFeePerGas: prices.maxFeePerGas,
      maxPriorityFeePerGas: prices.maxPriorityFeePerGas,
      estimatedCost,
      estimatedCostAXX: ethers.formatEther(estimatedCost)
    };
  }

  /**
   * Record gas price for history
   */
  async recordGasPrice(): Promise<void> {
    const block = await this.provider.getBlock('latest');
    if (block && block.baseFeePerGas) {
      this.priceHistory.push({
        blockNumber: block.number,
        baseFee: block.baseFeePerGas,
        timestamp: block.timestamp
      });

      // Trim history
      if (this.priceHistory.length > this.maxHistorySize) {
        this.priceHistory.shift();
      }
    }
  }

  /**
   * Get gas price statistics
   */
  getGasPriceStats(): {
    current: bigint;
    average: bigint;
    min: bigint;
    max: bigint;
    trend: 'up' | 'down' | 'stable';
  } | null {
    if (this.priceHistory.length < 2) return null;

    const prices = this.priceHistory.map(h => h.baseFee);
    const current = prices[prices.length - 1];
    const sum = prices.reduce((a, b) => a + b, 0n);
    const average = sum / BigInt(prices.length);
    const min = prices.reduce((a, b) => a < b ? a : b);
    const max = prices.reduce((a, b) => a > b ? a : b);

    // Calculate trend from recent 10 blocks
    const recent = prices.slice(-10);
    const recentAvg = recent.reduce((a, b) => a + b, 0n) / BigInt(recent.length);
    const oldAvg = prices.slice(0, -10).reduce((a, b) => a + b, 0n) / BigInt(Math.max(1, prices.length - 10));

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > oldAvg * 110n / 100n) trend = 'up';
    else if (recentAvg < oldAvg * 90n / 100n) trend = 'down';

    return { current, average, min, max, trend };
  }

  /**
   * Wait for lower gas prices
   */
  async waitForLowerGas(
    targetPrice: bigint,
    timeout: number = 300000 // 5 minutes
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const prices = await this.getGasPrices('standard');
      if (prices.baseFee <= targetPrice) {
        return true;
      }
      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    return false;
  }

  /**
   * Get gas cost for common operations
   */
  async getOperationCosts(speed: GasSpeed = 'standard'): Promise<Record<string, string>> {
    const prices = await this.getGasPrices(speed);
    const costs: Record<string, string> = {};

    for (const [operation, gasLimit] of Object.entries(DEFAULT_GAS_LIMITS)) {
      const cost = gasLimit * prices.maxFeePerGas;
      costs[operation] = ethers.formatEther(cost);
    }

    return costs;
  }
}

// ============ Utility Functions ============

/**
 * Format gas price to Gwei
 */
export function formatGwei(wei: bigint): string {
  return ethers.formatUnits(wei, 'gwei');
}

/**
 * Parse Gwei to Wei
 */
export function parseGwei(gwei: string | number): bigint {
  return ethers.parseUnits(gwei.toString(), 'gwei');
}

/**
 * Calculate transaction cost
 */
export function calculateTxCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice;
}

/**
 * Format AXX amount
 */
export function formatAXX(wei: bigint, decimals: number = 4): string {
  const formatted = ethers.formatEther(wei);
  const num = parseFloat(formatted);
  return num.toFixed(decimals);
}

/**
 * Parse AXX to Wei
 */
export function parseAXX(axx: string | number): bigint {
  return ethers.parseEther(axx.toString());
}

/**
 * Check if gas price is reasonable
 */
export function isReasonableGasPrice(
  gasPrice: bigint,
  maxAcceptable: bigint = parseGwei('100')
): boolean {
  return gasPrice <= maxAcceptable;
}

/**
 * Suggest optimal transaction time based on gas trends
 */
export function suggestOptimalTime(
  stats: { trend: 'up' | 'down' | 'stable' } | null
): string {
  if (!stats) return 'Unable to determine optimal time';
  
  switch (stats.trend) {
    case 'down':
      return 'Good time to transact - gas prices are falling';
    case 'up':
      return 'Consider waiting - gas prices are rising';
    case 'stable':
      return 'Normal conditions - proceed as needed';
  }
}
