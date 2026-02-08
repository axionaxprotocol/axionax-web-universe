'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';

interface ActivityScore {
  score: number;
  breakdown: Record<string, number>;
  tier: number;
  airdropAmount: string;
}

interface IndexerStats {
  lastIndexedBlock: number;
  lastIndexedAt: string | null;
  isRunning: boolean;
  status: string;
  stats: {
    blocks: number;
    transactions: number;
    addresses: number;
    tokenTransfers: number;
  };
}

const TIER_NAMES = [
  'Not eligible',
  'Bronze 🥉',
  'Silver 🥈',
  'Gold 🥇',
  'Platinum 💎',
];
const TIER_COLORS = [
  'text-dark-400',
  'text-amber-600',
  'text-gray-400',
  'text-yellow-400',
  'text-cyan-400',
];

export default function AirdropPage() {
  const { account } = useWeb3();
  const [activityScore, setActivityScore] = useState<ActivityScore | null>(
    null
  );
  const [indexerStats, setIndexerStats] = useState<IndexerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch indexer stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/indexer/status`);
        if (res.ok) {
          const data = await res.json();
          setIndexerStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch indexer stats:', err);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [API_URL]);

  // Fetch activity score when account changes
  useEffect(() => {
    async function fetchScore() {
      if (!account) {
        setActivityScore(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/activity/score/${account}`);
        if (res.ok) {
          const data = await res.json();
          setActivityScore(data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Failed to fetch activity score:', err);
        setError('API unavailable — please try again later');
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, [account, API_URL]);

  const formatAmount = (amount: string) => {
    const value = BigInt(amount);
    const formatted = Number(value / BigInt(10 ** 14)) / 10000;
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Testnet Activity & Airdrop
          </h1>
          <p className="text-xl text-dark-400 max-w-3xl mx-auto">
            Check your Testnet activity score and airdrop eligibility for
            Mainnet
          </p>
        </div>

        {/* Indexer Status */}
        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Testnet Indexer Status
              {indexerStats?.isRunning && (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                indexerStats?.status === 'running'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {indexerStats?.status || 'Unknown'}
            </span>
          </div>

          {indexerStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {indexerStats.stats.blocks.toLocaleString()}
                </div>
                <div className="text-sm text-dark-400">Blocks Indexed</div>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {indexerStats.stats.transactions.toLocaleString()}
                </div>
                <div className="text-sm text-dark-400">Transactions</div>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {indexerStats.stats.addresses.toLocaleString()}
                </div>
                <div className="text-sm text-dark-400">Unique Addresses</div>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {indexerStats.stats.tokenTransfers.toLocaleString()}
                </div>
                <div className="text-sm text-dark-400">Token Transfers</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-dark-400 py-8">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
        </div>

        {/* Activity Score Card */}
        <div className="bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-6 py-4 border-b border-dark-700">
            <h2 className="text-xl font-semibold text-white">
              🏆 Your Activity Score
            </h2>
          </div>

          <div className="p-6">
            {!account ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Connect wallet to view score
                </h3>
                <p className="text-dark-400 mb-6">
                  Connect your wallet to check activity score and eligibility
                  Airdrop
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-dark-400">Calculating score...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Failed to fetch data
                </h3>
                <p className="text-dark-400">{error}</p>
                <p className="text-sm text-dark-500 mt-4">
                  Note: API may be unavailable or this address has no data yet
                </p>
              </div>
            ) : activityScore ? (
              <div className="space-y-6">
                {/* Score Display */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-6xl font-bold text-white mb-2">
                      {activityScore.score.toLocaleString()}
                    </div>
                    <div className="text-dark-400">Activity Points</div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${TIER_COLORS[activityScore.tier]}`}
                    >
                      {TIER_NAMES[activityScore.tier]}
                    </div>
                    <div className="text-dark-400 mt-1">Airdrop Tier</div>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold text-green-400">
                      {formatAmount(activityScore.airdropAmount)} AXX
                    </div>
                    <div className="text-dark-400">Estimated Airdrop</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Score Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(activityScore.breakdown).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-dark-700/50 rounded-lg p-3"
                        >
                          <span className="text-dark-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-white font-semibold">
                            +{value.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* How to Earn More */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">
                    How to earn more score?
                  </h3>
                  <ul className="space-y-2 text-dark-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Send transactions on Testnet
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Transfer AXX tokens
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Stake tokens with Validators
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Participate in governance voting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Be an early adopter (lower block = higher score!)
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No activity data yet
                </h3>
                <p className="text-dark-400">
                  Use Testnet to earn score and airdrop eligibility!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tier Explanation */}
        <div className="mt-8 bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            🎯 Airdrop Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🥉</div>
              <div className="text-amber-600 font-bold">Bronze</div>
              <div className="text-sm text-dark-400 mt-1">100+ points</div>
              <div className="text-xs text-dark-500 mt-2">0.1% of pool</div>
            </div>
            <div className="bg-gray-500/20 border border-gray-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🥈</div>
              <div className="text-gray-400 font-bold">Silver</div>
              <div className="text-sm text-dark-400 mt-1">500+ points</div>
              <div className="text-xs text-dark-500 mt-2">0.5% of pool</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🥇</div>
              <div className="text-yellow-400 font-bold">Gold</div>
              <div className="text-sm text-dark-400 mt-1">1,000+ points</div>
              <div className="text-xs text-dark-500 mt-2">1% of pool</div>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-cyan-400 font-bold">Platinum</div>
              <div className="text-sm text-dark-400 mt-1">5,000+ points</div>
              <div className="text-xs text-dark-500 mt-2">5% of pool</div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                ข้อมูลสำคัญ
              </h3>
              <ul className="text-dark-300 space-y-1 text-sm">
                <li>
                  • Score is calculated from all Testnet activity before Mainnet
                  launch
                </li>
                <li>
                  • Snapshot will be created before Mainnet and included in
                  Genesis Block
                </li>
                <li>
                  • Token บน Testnet (AXXt) ไม่มีมูลค่าจริง -
                  ใช้สำหรับทดสอบเท่านั้น
                </li>
                <li>
                  • Airdrop amount is an estimate — final amount may vary based
                  on eligible addresses
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
