/**
 * axionax SDK v2.0 - Event Subscription System
 * Real-time event monitoring with WebSocket support
 */

import { ethers } from 'ethers';

// ============ Types ============

export interface EventFilter {
  address?: string;
  topics?: (string | string[] | null)[];
  fromBlock?: number | 'latest';
  toBlock?: number | 'latest';
}

export interface ParsedLog {
  address: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
  topics: string[];
  data: string;
  args?: Record<string, unknown>;
  eventName?: string;
}

export interface SubscriptionOptions {
  pollInterval?: number;  // For HTTP polling (default: 4000ms)
  confirmations?: number; // Wait for confirmations
  onError?: (error: Error) => void;
}

export type EventCallback<T = ParsedLog> = (event: T) => void;

// ============ Event Emitter ============

export class EventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, data: ParsedLog): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error('Event callback error:', e);
        }
      });
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// ============ Event Subscription Manager ============

export class EventSubscriptionManager {
  private provider: ethers.Provider;
  private subscriptions: Map<string, {
    filter: EventFilter;
    callback: EventCallback;
    unsubscribe: () => void;
  }> = new Map();
  private emitter: EventEmitter = new EventEmitter();
  private lastBlockChecked: number = 0;
  private pollInterval: NodeJS.Timer | null = null;
  private isPolling: boolean = false;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  /**
   * Subscribe to contract events
   */
  subscribe(
    name: string,
    filter: EventFilter,
    callback: EventCallback,
    options: SubscriptionOptions = {}
  ): () => void {
    const { pollInterval = 4000, onError } = options;

    // Store subscription
    const unsubscribe = () => this.unsubscribe(name);
    this.subscriptions.set(name, { filter, callback, unsubscribe });

    // Add to event emitter
    this.emitter.on(name, callback);

    // Start polling if not already
    if (!this.pollInterval) {
      this.startPolling(pollInterval, onError);
    }

    return unsubscribe;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(name: string): void {
    const sub = this.subscriptions.get(name);
    if (sub) {
      this.emitter.off(name, sub.callback);
      this.subscriptions.delete(name);
    }

    // Stop polling if no more subscriptions
    if (this.subscriptions.size === 0 && this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Start event polling
   */
  private async startPolling(interval: number, onError?: (error: Error) => void): Promise<void> {
    // Get initial block
    this.lastBlockChecked = await this.provider.getBlockNumber();

    this.pollInterval = setInterval(async () => {
      if (this.isPolling) return;
      this.isPolling = true;

      try {
        const currentBlock = await this.provider.getBlockNumber();
        
        if (currentBlock > this.lastBlockChecked) {
          // Check each subscription
          for (const [name, sub] of this.subscriptions) {
            try {
              const logs = await this.provider.getLogs({
                ...sub.filter,
                fromBlock: this.lastBlockChecked + 1,
                toBlock: currentBlock
              });

              for (const log of logs) {
                const parsedLog: ParsedLog = {
                  address: log.address,
                  blockNumber: log.blockNumber,
                  blockHash: log.blockHash,
                  transactionHash: log.transactionHash,
                  transactionIndex: log.transactionIndex,
                  logIndex: log.index,
                  removed: log.removed,
                  topics: [...log.topics],
                  data: log.data
                };

                this.emitter.emit(name, parsedLog);
              }
            } catch (e) {
              console.error(`Error fetching logs for ${name}:`, e);
              onError?.(e instanceof Error ? e : new Error(String(e)));
            }
          }

          this.lastBlockChecked = currentBlock;
        }
      } catch (e) {
        console.error('Polling error:', e);
        onError?.(e instanceof Error ? e : new Error(String(e)));
      } finally {
        this.isPolling = false;
      }
    }, interval);
  }

  /**
   * Get past events
   */
  async getPastEvents(
    filter: EventFilter,
    fromBlock: number,
    toBlock: number | 'latest' = 'latest'
  ): Promise<ParsedLog[]> {
    const logs = await this.provider.getLogs({
      ...filter,
      fromBlock,
      toBlock
    });

    return logs.map(log => ({
      address: log.address,
      blockNumber: log.blockNumber,
      blockHash: log.blockHash,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
      logIndex: log.index,
      removed: log.removed,
      topics: [...log.topics],
      data: log.data
    }));
  }

  /**
   * Stop all subscriptions
   */
  stop(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.subscriptions.clear();
    this.emitter.removeAllListeners();
  }

  /**
   * Get active subscription count
   */
  get activeSubscriptions(): number {
    return this.subscriptions.size;
  }
}

// ============ Contract Event Helper ============

/**
 * Helper to create event filters from contract interface
 */
export function createEventFilter(
  contractAddress: string,
  eventSignature: string,
  indexedParams?: (string | null)[]
): EventFilter {
  const eventTopic = ethers.id(eventSignature);
  const topics: (string | null)[] = [eventTopic];

  if (indexedParams) {
    for (const param of indexedParams) {
      if (param === null) {
        topics.push(null);
      } else if (param.startsWith('0x')) {
        // Address or bytes32
        topics.push(ethers.zeroPadValue(param, 32));
      } else {
        // String - hash it
        topics.push(ethers.id(param));
      }
    }
  }

  return {
    address: contractAddress,
    topics: topics as string[]
  };
}

// ============ Predefined Event Filters ============

export const EventFilters = {
  // ERC20 Transfer
  transfer: (tokenAddress: string, from?: string, to?: string): EventFilter => {
    return createEventFilter(
      tokenAddress,
      'Transfer(address,address,uint256)',
      [from || null, to || null]
    );
  },

  // ERC20 Approval
  approval: (tokenAddress: string, owner?: string, spender?: string): EventFilter => {
    return createEventFilter(
      tokenAddress,
      'Approval(address,address,uint256)',
      [owner || null, spender || null]
    );
  },

  // Staking Staked
  staked: (stakingAddress: string, user?: string): EventFilter => {
    return createEventFilter(
      stakingAddress,
      'Staked(address,uint256)',
      [user || null]
    );
  },

  // Governance ProposalCreated
  proposalCreated: (governanceAddress: string): EventFilter => {
    return createEventFilter(
      governanceAddress,
      'ProposalCreated(uint256,address,string,uint256,uint256)'
    );
  },

  // Escrow Created
  escrowCreated: (escrowAddress: string, payer?: string): EventFilter => {
    return createEventFilter(
      escrowAddress,
      'EscrowCreated(string,address,uint256,address)',
      [null, payer || null]
    );
  },

  // Escrow Released
  escrowReleased: (escrowAddress: string, worker?: string): EventFilter => {
    return createEventFilter(
      escrowAddress,
      'EscrowReleased(string,address,uint256,uint256)',
      [null, worker || null]
    );
  }
};

// ============ WebSocket Provider Helper ============

/**
 * Create WebSocket provider for real-time events
 */
export function createWebSocketProvider(wsUrl: string): ethers.WebSocketProvider {
  return new ethers.WebSocketProvider(wsUrl);
}

/**
 * Subscribe to new blocks via WebSocket
 */
export function subscribeToBlocks(
  provider: ethers.WebSocketProvider,
  callback: (blockNumber: number) => void
): () => void {
  provider.on('block', callback);
  return () => provider.off('block', callback);
}

/**
 * Subscribe to pending transactions via WebSocket
 */
export function subscribeToPendingTransactions(
  provider: ethers.WebSocketProvider,
  callback: (txHash: string) => void
): () => void {
  provider.on('pending', callback);
  return () => provider.off('pending', callback);
}
