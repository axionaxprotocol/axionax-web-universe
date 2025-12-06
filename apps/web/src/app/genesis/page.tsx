'use client';

import React, { useState, useEffect } from 'react';

interface GenesisSnapshot {
  id: number;
  snapshotBlock: string;
  totalAddresses: number;
  totalAllocation: string;
  merkleRoot: string;
  createdAt: string;
  isFinalized: boolean;
}

interface AddressAllocation {
  address: string;
  score: number;
  tier: number;
  allocation: string;
  merkleProof: string[];
}

export default function GenesisPage() {
  const [snapshots, setSnapshots] = useState<GenesisSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<GenesisSnapshot | null>(null);
  const [allocations, setAllocations] = useState<AddressAllocation[]>([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<AddressAllocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch snapshots
  useEffect(() => {
    async function fetchSnapshots() {
      try {
        const res = await fetch(`${API_URL}/api/genesis/snapshots`);
        if (res.ok) {
          const data = await res.json();
          setSnapshots(data);
          if (data.length > 0) {
            setSelectedSnapshot(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch snapshots:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshots();
  }, [API_URL]);

  // Fetch allocations when snapshot changes
  useEffect(() => {
    async function fetchAllocations() {
      if (!selectedSnapshot) return;

      try {
        const res = await fetch(`${API_URL}/api/genesis/snapshots/${selectedSnapshot.id}/allocations?limit=20`);
        if (res.ok) {
          const data = await res.json();
          setAllocations(data);
        }
      } catch (err) {
        console.error('Failed to fetch allocations:', err);
      }
    }
    fetchAllocations();
  }, [selectedSnapshot, API_URL]);

  // Search for address
  const handleSearch = async () => {
    if (!searchAddress || !selectedSnapshot) return;

    try {
      const res = await fetch(`${API_URL}/api/genesis/snapshots/${selectedSnapshot.id}/allocation/${searchAddress}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        setSearchResult(null);
      }
    } catch (err) {
      console.error('Failed to search address:', err);
      setSearchResult(null);
    }
  };

  // Download genesis.json
  const handleDownloadGenesis = async () => {
    if (!selectedSnapshot) return;

    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/genesis/snapshots/${selectedSnapshot.id}/genesis.json`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `genesis-${selectedSnapshot.snapshotBlock}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download genesis:', err);
    } finally {
      setDownloading(false);
    }
  };

  const formatAmount = (amount: string) => {
    const value = BigInt(amount);
    const formatted = Number(value / BigInt(10 ** 14)) / 10000;
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const TIER_NAMES = ['N/A', 'Bronze', 'Silver', 'Gold', 'Platinum'];
  const TIER_EMOJIS = ['❌', '🥉', '🥈', '🥇', '💎'];

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🌟 Genesis Block & Snapshots
          </h1>
          <p className="text-xl text-dark-400 max-w-3xl mx-auto">
            ดู Genesis Snapshots และตรวจสอบการจัดสรร Token สำหรับ Mainnet
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-dark-400">กำลังโหลดข้อมูล...</p>
          </div>
        ) : snapshots.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">ยังไม่มี Snapshot</h3>
            <p className="text-dark-400">
              Genesis snapshot จะถูกสร้างก่อน Mainnet launch
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Snapshot Selector */}
            <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📋 Select Snapshot</h2>
              <div className="flex flex-wrap gap-2">
                {snapshots.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => setSelectedSnapshot(snap)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedSnapshot?.id === snap.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                    }`}
                  >
                    Block #{snap.snapshotBlock}
                    {snap.isFinalized && <span className="ml-2">✅</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshot Details */}
            {selectedSnapshot && (
              <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-white">
                    📊 Snapshot Details
                    {selectedSnapshot.isFinalized && (
                      <span className="ml-2 text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Finalized
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={handleDownloadGenesis}
                    disabled={downloading || !selectedSnapshot.isFinalized}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:text-dark-500 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {downloading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        กำลังดาวน์โหลด...
                      </>
                    ) : (
                      <>
                        📥 Download genesis.json
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">
                      #{selectedSnapshot.snapshotBlock}
                    </div>
                    <div className="text-sm text-dark-400">Snapshot Block</div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">
                      {selectedSnapshot.totalAddresses.toLocaleString()}
                    </div>
                    <div className="text-sm text-dark-400">Total Addresses</div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {formatAmount(selectedSnapshot.totalAllocation)} AXX
                    </div>
                    <div className="text-sm text-dark-400">Total Allocation</div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-xs font-mono text-white break-all">
                      {selectedSnapshot.merkleRoot.slice(0, 20)}...
                    </div>
                    <div className="text-sm text-dark-400 mt-1">Merkle Root</div>
                  </div>
                </div>

                {/* Full Merkle Root */}
                <div className="bg-dark-800/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-dark-400">Full Merkle Root</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedSnapshot.merkleRoot)}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="font-mono text-xs text-white break-all bg-dark-900 rounded p-2">
                    {selectedSnapshot.merkleRoot}
                  </div>
                </div>

                {/* Search Address */}
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">🔍 Search Address</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="0x..."
                      className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                      Search
                    </button>
                  </div>

                  {searchResult && (
                    <div className="mt-4 bg-dark-900 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-dark-400">Score</div>
                          <div className="text-lg font-bold text-white">{searchResult.score}</div>
                        </div>
                        <div>
                          <div className="text-sm text-dark-400">Tier</div>
                          <div className="text-lg font-bold">
                            {TIER_EMOJIS[searchResult.tier]} {TIER_NAMES[searchResult.tier]}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-dark-400">Allocation</div>
                          <div className="text-lg font-bold text-green-400">
                            {formatAmount(searchResult.allocation)} AXX
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-dark-400">Merkle Proof</div>
                          <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(searchResult.merkleProof))}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                          >
                            📋 Copy Proof ({searchResult.merkleProof.length} items)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Allocations */}
            {allocations.length > 0 && (
              <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">🏆 Top Allocations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-700">
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Rank</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Address</th>
                        <th className="text-right py-3 px-4 text-dark-400 font-medium">Score</th>
                        <th className="text-center py-3 px-4 text-dark-400 font-medium">Tier</th>
                        <th className="text-right py-3 px-4 text-dark-400 font-medium">Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((alloc, idx) => (
                        <tr key={alloc.address} className="border-b border-dark-800 hover:bg-dark-800/30">
                          <td className="py-3 px-4 text-white">#{idx + 1}</td>
                          <td className="py-3 px-4 font-mono text-sm">
                            <a
                              href={`https://explorer.axionax.xyz/address/${alloc.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300"
                            >
                              {formatAddress(alloc.address)}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-right text-white">{alloc.score.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            {TIER_EMOJIS[alloc.tier]} {TIER_NAMES[alloc.tier]}
                          </td>
                          <td className="py-3 px-4 text-right text-green-400 font-medium">
                            {formatAmount(alloc.allocation)} AXX
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Genesis Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📜</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Genesis Block คืออะไร?</h3>
                  <p className="text-dark-300 mb-4">
                    Genesis Block คือ Block แรกของ Mainnet ที่จะบรรจุข้อมูลการจัดสรร Token ให้กับผู้ใช้ Testnet 
                    โดยใช้ Merkle Tree เพื่อความโปร่งใสและตรวจสอบได้
                  </p>
                  <ul className="text-dark-300 space-y-1 text-sm">
                    <li>• <strong>Merkle Root</strong> - Hash ที่รวมข้อมูลทั้งหมด ใช้ตรวจสอบความถูกต้อง</li>
                    <li>• <strong>Merkle Proof</strong> - หลักฐานที่พิสูจน์ว่า address อยู่ใน snapshot</li>
                    <li>• <strong>Snapshot</strong> - บันทึกสถานะ ณ block ที่กำหนด</li>
                    <li>• <strong>Finalized</strong> - Snapshot ที่ถูก approve แล้ว จะไม่เปลี่ยนแปลง</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
