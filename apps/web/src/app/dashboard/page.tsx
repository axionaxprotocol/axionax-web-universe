'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/contexts/Web3Context';

interface NodeInfo {
  id: string;
  nodeType: 'validator' | 'worker' | 'rpc';
  nodeName: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended' | 'slashed';
  serverIp: string;
  walletAddress: string;
  uptime: number;
  stakeAmount: string;
  totalRewards: string;
  registeredAt: string;
  lastSeenAt: string | null;
}

interface NodeStats {
  total: number;
  byType: { validator: number; worker: number; rpc: number };
  byStatus: { pending: number; active: number; inactive: number; suspended: number; slashed: number };
  totalStaked: string;
}

interface HealthCheck {
  id: string;
  isOnline: boolean;
  latencyMs: number;
  blockHeight: number;
  peerCount: number;
  checkedAt: string;
}

export default function NodeDashboardPage() {
  const { account } = useWeb3();
  const [myNode, setMyNode] = useState<NodeInfo | null>(null);
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [healthHistory, setHealthHistory] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/nodes/stats/overview`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    }
    fetchStats();
  }, [API_URL]);

  // Fetch my node (if connected)
  useEffect(() => {
    async function fetchMyNode() {
      if (!account) {
        setMyNode(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/nodes?wallet=${account}`);
        if (res.ok) {
          const data = await res.json();
          if (data.nodes && data.nodes.length > 0) {
            setMyNode(data.nodes[0]);
            // Fetch health history
            const healthRes = await fetch(`${API_URL}/api/nodes/${data.nodes[0].id}/health`);
            if (healthRes.ok) {
              const healthData = await healthRes.json();
              setHealthHistory(healthData.healthChecks || []);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch node:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyNode();
  }, [account, API_URL]);

  const formatAmount = (amount: string) => {
    const value = BigInt(amount);
    const formatted = Number(value / BigInt(10 ** 14)) / 10000;
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    slashed: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const NODE_ICONS: Record<string, string> = {
    validator: '🛡️',
    worker: '⚙️',
    rpc: '📡',
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📊 Node Dashboard
            </h1>
            <p className="text-dark-400">
              จัดการและตรวจสอบสถานะ node ของคุณ
            </p>
          </div>
          <Link
            href="/join"
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all"
          >
            🚀 ลงทะเบียน Node ใหม่
          </Link>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-900/50 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-400 text-sm mb-1">Total Nodes</div>
            <div className="text-3xl font-bold text-white">{stats?.total || 0}</div>
          </div>
          <div className="bg-dark-900/50 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-400 text-sm mb-1">Active Validators</div>
            <div className="text-3xl font-bold text-green-400">{stats?.byStatus.active || 0}</div>
          </div>
          <div className="bg-dark-900/50 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-400 text-sm mb-1">Total Staked</div>
            <div className="text-2xl font-bold text-primary-400">
              {stats ? formatAmount(stats.totalStaked) : '0'} AXX
            </div>
          </div>
          <div className="bg-dark-900/50 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-400 text-sm mb-1">Pending Registration</div>
            <div className="text-3xl font-bold text-yellow-400">{stats?.byStatus.pending || 0}</div>
          </div>
        </div>

        {/* My Node Section */}
        {!account ? (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-8 text-center mb-8">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              เชื่อมต่อ Wallet เพื่อดู Node ของคุณ
            </h2>
            <p className="text-dark-400 mb-4">
              เชื่อมต่อ wallet ที่ใช้ลงทะเบียน node เพื่อดูสถานะและจัดการ
            </p>
          </div>
        ) : loading ? (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-8 text-center mb-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-dark-400">กำลังโหลดข้อมูล Node...</p>
          </div>
        ) : myNode ? (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-dark-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{NODE_ICONS[myNode.nodeType]}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{myNode.nodeName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm border ${STATUS_COLORS[myNode.status]}`}>
                        {myNode.status.charAt(0).toUpperCase() + myNode.status.slice(1)}
                      </span>
                      <span className="text-dark-400 text-sm capitalize">{myNode.nodeType}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-dark-400 text-sm">Uptime</div>
                  <div className={`text-2xl font-bold ${myNode.uptime >= 95 ? 'text-green-400' : myNode.uptime >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {myNode.uptime.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <div className="text-dark-400 text-sm mb-1">💰 Stake Amount</div>
                  <div className="text-xl font-bold text-primary-400">
                    {formatAmount(myNode.stakeAmount)} AXX
                  </div>
                  {myNode.status === 'pending' && (
                    <Link
                      href={`/stake?node=${myNode.id}`}
                      className="text-sm text-primary-400 hover:text-primary-300 mt-2 inline-block"
                    >
                      → Stake tokens to activate
                    </Link>
                  )}
                </div>
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <div className="text-dark-400 text-sm mb-1">🎁 Total Rewards</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatAmount(myNode.totalRewards)} AXX
                  </div>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <div className="text-dark-400 text-sm mb-1">🌐 Server IP</div>
                  <div className="text-lg font-mono text-white">{myNode.serverIp}</div>
                </div>
              </div>

              {/* Health History Chart (simplified) */}
              {healthHistory.length > 0 && (
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">📈 Health History (Last 24h)</h3>
                  <div className="flex items-end gap-1 h-20">
                    {healthHistory.slice(0, 48).map((check, i) => (
                      <div
                        key={check.id || i}
                        className={`flex-1 rounded-t ${check.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ height: check.isOnline ? `${Math.min(100, (1000 - check.latencyMs) / 10)}%` : '10%' }}
                        title={`${check.isOnline ? 'Online' : 'Offline'} - ${check.latencyMs}ms`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-dark-500 mt-2">
                    <span>24h ago</span>
                    <span>Now</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-dark-800 bg-dark-800/30">
              <div className="flex flex-wrap gap-3">
                {myNode.status === 'pending' && (
                  <Link
                    href={`/stake?node=${myNode.id}`}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    💰 Stake to Activate
                  </Link>
                )}
                <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors">
                  🔄 Refresh Status
                </button>
                <Link
                  href="/validators"
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                >
                  📊 View Leaderboard
                </Link>
                <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors">
                  📋 Copy Node Config
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-8 text-center mb-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              ยังไม่มี Node ที่ลงทะเบียน
            </h2>
            <p className="text-dark-400 mb-6">
              Wallet นี้ยังไม่ได้ลงทะเบียน node ใดๆ
            </p>
            <Link
              href="/join"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all inline-block"
            >
              🚀 ลงทะเบียน Node
            </Link>
          </div>
        )}

        {/* Node Type Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🛡️</div>
              <div>
                <h3 className="text-xl font-bold text-white">Validators</h3>
                <p className="text-dark-400 text-sm">Block producers</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-primary-400 mb-2">
              {stats?.byType.validator || 0}
            </div>
            <div className="text-sm text-dark-400">
              Stake required: 10,000 AXX
            </div>
          </div>
          
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">⚙️</div>
              <div>
                <h3 className="text-xl font-bold text-white">Workers</h3>
                <p className="text-dark-400 text-sm">Computation nodes</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {stats?.byType.worker || 0}
            </div>
            <div className="text-sm text-dark-400">
              Stake required: 1,000 AXX
            </div>
          </div>
          
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">📡</div>
              <div>
                <h3 className="text-xl font-bold text-white">RPC Nodes</h3>
                <p className="text-dark-400 text-sm">API providers</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {stats?.byType.rpc || 0}
            </div>
            <div className="text-sm text-dark-400">
              No stake required
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">📚 Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/docs"
              className="p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div className="text-2xl mb-2">📖</div>
              <div className="text-white font-medium">Documentation</div>
              <div className="text-dark-400 text-sm">Setup guides & tutorials</div>
            </Link>
            <Link
              href="/validators"
              className="p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-white font-medium">Leaderboard</div>
              <div className="text-dark-400 text-sm">Top validators</div>
            </Link>
            <Link
              href="/faucet"
              className="p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div className="text-2xl mb-2">💧</div>
              <div className="text-white font-medium">Faucet</div>
              <div className="text-dark-400 text-sm">Get testnet tokens</div>
            </Link>
            <a
              href="https://discord.gg/axionax"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="text-white font-medium">Discord</div>
              <div className="text-dark-400 text-sm">Community support</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
