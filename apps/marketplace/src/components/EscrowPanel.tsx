import React, { useState, useEffect } from 'react';
import { 
  AxionaxClient, 
  createClient, 
  EscrowStatus, 
  EscrowTransaction,
  AxionaxConfig 
} from '@axionax/sdk';

interface EscrowPanelProps {
  jobId: string;
  client?: AxionaxClient;
  className?: string;
}

const defaultConfig: AxionaxConfig = {
  rpcUrl: 'https://rpc.axionax.network', // Example URL
  chainId: 1234,
};

export const EscrowPanel: React.FC<EscrowPanelProps> = ({ 
  jobId, 
  client: propClient,
  className = ''
}) => {
  const [client] = useState<AxionaxClient>(() => propClient || createClient(defaultConfig));
  const [escrowState, setEscrowState] = useState<EscrowTransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('0');

  useEffect(() => {
    fetchEscrowStatus();
  }, [jobId]);

  const fetchEscrowStatus = async () => {
    try {
      setLoading(true);
      const status = await client.getEscrowStatus(jobId);
      setEscrowState(status);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch escrow status:', err);
      // In a real app we might show an error, but here we might just have no data
      // setError('Failed to load escrow details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Convert string amount to bigint (assuming 18 decimals for simplicity in this demo)
      // In production, use ethers.parseUnits or similar
      const value = BigInt(parseFloat(amount) * 1e18); 
      const tx = await client.depositEscrow(jobId, value);
      setEscrowState(tx);
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async () => {
    try {
      setLoading(true);
      setError(null);
      const tx = await client.releaseEscrow(jobId);
      setEscrowState(tx);
    } catch (err: any) {
      setError(err.message || 'Release failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    try {
      setLoading(true);
      setError(null);
      const tx = await client.refundEscrow(jobId);
      setEscrowState(tx);
    } catch (err: any) {
      setError(err.message || 'Refund failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.Pending:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case EscrowStatus.Deposited:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case EscrowStatus.Released:
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case EscrowStatus.Refunded:
        return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case EscrowStatus.Disputed:
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getDisplayStatus = (status?: EscrowStatus) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatAmount = (value?: bigint) => {
    if (value === undefined) return '0.00';
    // Simple format for demo
    return (Number(value) / 1e18).toFixed(4);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">Escrow Contract</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(escrowState?.status)}`}>
              {getDisplayStatus(escrowState?.status)}
            </div>
          </div>
          <p className="text-slate-400 text-sm font-mono truncate">
            ID: {jobId}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Amount Card */}
          <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <p className="text-slate-400 text-sm mb-1">Locked Amount</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {formatAmount(escrowState?.amount)}
              </span>
              <span className="text-blue-400 font-medium">AXX</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Input for Deposit */}
            {(!escrowState || escrowState.status === EscrowStatus.Pending) && (
              <div className="mb-4">
                <label className="block text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold">
                  Deposit Amount (AXX)
                </label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {(!escrowState || escrowState.status === EscrowStatus.Pending) && (
                <button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="col-span-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Deposit Funds'}
                </button>
              )}

              {escrowState?.status === EscrowStatus.Deposited && (
                <>
                  <button
                    onClick={handleRelease}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Release
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refund
                  </button>
                </>
              )}
            </div>

            {/* Completed State Info */}
            {(escrowState?.status === EscrowStatus.Released || escrowState?.status === EscrowStatus.Refunded) && (
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-slate-300">
                  Transaction completed on {escrowState.updatedAt.toLocaleDateString()}
                </p>
                {escrowState.txHash && (
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 mt-1 block truncate">
                    {escrowState.txHash}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
