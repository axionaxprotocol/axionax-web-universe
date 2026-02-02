'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  generateNewWallet,
  importFromMnemonic,
  importFromPrivateKey,
  type GeneratedWallet,
  type ImportedWallet,
} from '@/lib/wallet-generator';
import { getBalance, AXIONAX_TESTNET } from '@/lib/web3';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type TabType = 'create' | 'import-mnemonic' | 'import-key';

interface StoredWallet {
  address: string;
  name: string;
  createdAt: number;
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [wallet, setWallet] = useState<GeneratedWallet | ImportedWallet | null>(
    null
  );
  const [storedWallets, setStoredWallets] = useState<StoredWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  // Form states
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'backup' | 'confirm' | 'done'>(
    'form'
  );
  const [backupConfirmed, setBackupConfirmed] = useState(false);

  // Load stored wallets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('axionax_wallets');
    if (saved) {
      try {
        const wallets = JSON.parse(saved) as StoredWallet[];
        setStoredWallets(wallets);
        if (wallets.length > 0 && !selectedWallet) {
          setSelectedWallet(wallets[0].address);
        }
      } catch {
        // Invalid data, reset
        localStorage.removeItem('axionax_wallets');
      }
    }
  }, [selectedWallet]);

  // Load balance for selected wallet
  useEffect(() => {
    async function loadBalance() {
      if (selectedWallet) {
        try {
          const bal = await getBalance(selectedWallet);
          setBalance(bal.toString());
        } catch {
          setBalance('0');
        }
      }
    }
    loadBalance();
    const interval = setInterval(loadBalance, 15000);
    return () => clearInterval(interval);
  }, [selectedWallet]);

  const handleCreateWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate slight delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newWallet = generateNewWallet();
      setWallet(newWallet);
      setStep('backup');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportMnemonic = async () => {
    setLoading(true);
    setError(null);

    try {
      const imported = importFromMnemonic(mnemonic);
      setWallet(imported);
      setStep('done');
      saveWallet(imported.address);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportPrivateKey = async () => {
    setLoading(true);
    setError(null);

    try {
      const imported = importFromPrivateKey(privateKey);
      setWallet(imported);
      setStep('done');
      saveWallet(imported.address);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveWallet = (address: string) => {
    const newWallet: StoredWallet = {
      address,
      name: walletName || `Wallet ${storedWallets.length + 1}`,
      createdAt: Date.now(),
    };

    const updated = [
      ...storedWallets.filter((w) => w.address !== address),
      newWallet,
    ];
    setStoredWallets(updated);
    setSelectedWallet(address);
    localStorage.setItem('axionax_wallets', JSON.stringify(updated));
  };

  const handleConfirmBackup = () => {
    if (wallet && backupConfirmed) {
      saveWallet(wallet.address);
      setStep('done');
    }
  };

  const deleteWallet = (address: string) => {
    const updated = storedWallets.filter((w) => w.address !== address);
    setStoredWallets(updated);
    localStorage.setItem('axionax_wallets', JSON.stringify(updated));
    if (selectedWallet === address) {
      setSelectedWallet(updated[0]?.address || null);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetForm = () => {
    setWallet(null);
    setMnemonic('');
    setPrivateKey('');
    setWalletName('');
    setError(null);
    setStep('form');
    setBackupConfirmed(false);
    setShowPrivateKey(false);
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              👛 Wallet Manager
            </h1>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              สร้างหรือนำเข้า wallet เพื่อเข้าร่วม Axionax Testnet
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: My Wallets */}
            <div className="lg:col-span-1">
              <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-4">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  📋 My Wallets
                  <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                    {storedWallets.length}
                  </span>
                </h2>

                {storedWallets.length === 0 ? (
                  <div className="text-center py-8 text-dark-400">
                    <div className="text-4xl mb-2">🔐</div>
                    <p className="text-sm">ยังไม่มี wallet</p>
                    <p className="text-xs mt-1">สร้างหรือนำเข้า wallet ใหม่</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {storedWallets.map((w) => (
                      <div
                        key={w.address}
                        onClick={() => setSelectedWallet(w.address)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedWallet === w.address
                            ? 'bg-primary-500/20 border border-primary-500/50'
                            : 'bg-dark-800/50 border border-dark-700 hover:border-dark-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white text-sm">
                              {w.name}
                            </div>
                            <div className="font-mono text-xs text-dark-400">
                              {formatAddress(w.address)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('ลบ wallet นี้?'))
                                deleteWallet(w.address);
                            }}
                            className="text-dark-500 hover:text-red-400 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Wallet Info */}
                {selectedWallet && (
                  <div className="mt-4 pt-4 border-t border-dark-700">
                    <div className="text-sm text-dark-400 mb-1">Balance</div>
                    <div className="text-2xl font-bold text-green-400">
                      {balance} AXX
                    </div>
                    <div className="mt-3 space-y-2">
                      <Link
                        href={`/faucet?address=${selectedWallet}`}
                        className="block w-full text-center py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
                      >
                        💧 รับ Testnet Tokens
                      </Link>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedWallet, 'address')
                        }
                        className="w-full py-2 px-4 bg-dark-800 hover:bg-dark-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {copied === 'address'
                          ? '✅ Copied!'
                          : '📋 Copy Address'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Create/Import */}
            <div className="lg:col-span-2">
              <div className="bg-dark-900/50 border border-dark-800 rounded-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-dark-700">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
                      activeTab === 'create'
                        ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    ✨ สร้าง Wallet ใหม่
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('import-mnemonic');
                    }}
                    className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
                      activeTab === 'import-mnemonic'
                        ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    📝 Import Mnemonic
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('import-key');
                    }}
                    className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
                      activeTab === 'import-key'
                        ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    🔑 Import Private Key
                  </button>
                </div>

                <div className="p-6">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* CREATE TAB */}
                  {activeTab === 'create' && (
                    <>
                      {step === 'form' && (
                        <div className="space-y-6">
                          <div className="text-center py-8">
                            <div className="text-6xl mb-4">🆕</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              สร้าง Wallet ใหม่
                            </h3>
                            <p className="text-dark-400 max-w-md mx-auto">
                              ระบบจะสร้าง wallet พร้อม recovery phrase 12 คำ
                              กรุณาเก็บรักษา phrase นี้ไว้อย่างปลอดภัย
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm text-dark-400 mb-2">
                              ชื่อ Wallet (optional)
                            </label>
                            <input
                              type="text"
                              value={walletName}
                              onChange={(e) => setWalletName(e.target.value)}
                              placeholder="My Testnet Wallet"
                              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={handleCreateWallet}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                กำลังสร้าง...
                              </>
                            ) : (
                              <>✨ สร้าง Wallet</>
                            )}
                          </button>
                        </div>
                      )}

                      {step === 'backup' && wallet && 'mnemonic' in wallet && (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📝</div>
                            <h3 className="text-xl font-semibold text-white">
                              สำรอง Recovery Phrase
                            </h3>
                            <p className="text-dark-400 text-sm mt-1">
                              จดหรือ copy คำเหล่านี้และเก็บไว้อย่างปลอดภัย
                            </p>
                          </div>

                          {/* Mnemonic Display */}
                          <div className="bg-dark-800/50 border border-amber-500/30 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-amber-400 text-sm font-medium">
                                ⚠️ เก็บรักษาคำเหล่านี้ให้ปลอดภัย!
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    wallet.mnemonic || '',
                                    'mnemonic'
                                  )
                                }
                                className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded text-white"
                              >
                                {copied === 'mnemonic'
                                  ? '✅ Copied!'
                                  : '📋 Copy'}
                              </button>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                              {wallet.mnemonic?.split(' ').map((word, i) => (
                                <div
                                  key={i}
                                  className="bg-dark-900 rounded-lg px-3 py-2 text-center"
                                >
                                  <span className="text-dark-500 text-xs mr-1">
                                    {i + 1}.
                                  </span>
                                  <span className="text-white font-mono">
                                    {word}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address Preview */}
                          <div className="bg-dark-800/50 rounded-xl p-4">
                            <div className="text-sm text-dark-400 mb-1">
                              Wallet Address
                            </div>
                            <div className="font-mono text-white break-all">
                              {wallet.address}
                            </div>
                          </div>

                          {/* Confirmation */}
                          <label className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl cursor-pointer">
                            <input
                              type="checkbox"
                              checked={backupConfirmed}
                              onChange={(e) =>
                                setBackupConfirmed(e.target.checked)
                              }
                              className="mt-1 w-5 h-5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-dark-300">
                              ฉันได้บันทึก recovery phrase
                              แล้วและเข้าใจว่าหากสูญหาย จะไม่สามารถกู้คืน wallet
                              ได้
                            </span>
                          </label>

                          <div className="flex gap-3">
                            <button
                              onClick={resetForm}
                              className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors"
                            >
                              ← ย้อนกลับ
                            </button>
                            <button
                              onClick={handleConfirmBackup}
                              disabled={!backupConfirmed}
                              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:text-dark-500 text-white font-semibold rounded-xl transition-colors"
                            >
                              ยืนยัน →
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 'done' && wallet && (
                        <WalletSuccess
                          wallet={wallet}
                          onReset={resetForm}
                          showPrivateKey={showPrivateKey}
                          setShowPrivateKey={setShowPrivateKey}
                          copyToClipboard={copyToClipboard}
                          copied={copied}
                        />
                      )}
                    </>
                  )}

                  {/* IMPORT MNEMONIC TAB */}
                  {activeTab === 'import-mnemonic' && (
                    <>
                      {step === 'form' && (
                        <div className="space-y-6">
                          <div className="text-center py-4">
                            <div className="text-4xl mb-2">📝</div>
                            <h3 className="text-lg font-semibold text-white">
                              นำเข้าจาก Recovery Phrase
                            </h3>
                            <p className="text-dark-400 text-sm">
                              ใส่ 12 หรือ 24 คำ Recovery Phrase ของคุณ
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm text-dark-400 mb-2">
                              Recovery Phrase (Mnemonic)
                            </label>
                            <textarea
                              value={mnemonic}
                              onChange={(e) =>
                                setMnemonic(e.target.value.toLowerCase())
                              }
                              placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                              rows={4}
                              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none font-mono"
                            />
                            <p className="text-xs text-dark-500 mt-1">
                              แยกแต่ละคำด้วยช่องว่าง
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm text-dark-400 mb-2">
                              ชื่อ Wallet (optional)
                            </label>
                            <input
                              type="text"
                              value={walletName}
                              onChange={(e) => setWalletName(e.target.value)}
                              placeholder="My Imported Wallet"
                              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={handleImportMnemonic}
                            disabled={loading || !mnemonic.trim()}
                            className="w-full py-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                กำลังนำเข้า...
                              </>
                            ) : (
                              <>📥 นำเข้า Wallet</>
                            )}
                          </button>
                        </div>
                      )}

                      {step === 'done' && wallet && (
                        <WalletSuccess
                          wallet={wallet}
                          onReset={resetForm}
                          showPrivateKey={showPrivateKey}
                          setShowPrivateKey={setShowPrivateKey}
                          copyToClipboard={copyToClipboard}
                          copied={copied}
                        />
                      )}
                    </>
                  )}

                  {/* IMPORT PRIVATE KEY TAB */}
                  {activeTab === 'import-key' && (
                    <>
                      {step === 'form' && (
                        <div className="space-y-6">
                          <div className="text-center py-4">
                            <div className="text-4xl mb-2">🔑</div>
                            <h3 className="text-lg font-semibold text-white">
                              นำเข้าจาก Private Key
                            </h3>
                            <p className="text-dark-400 text-sm">
                              ใส่ Private Key (64 ตัวอักษร hex)
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm text-dark-400 mb-2">
                              Private Key
                            </label>
                            <input
                              type="password"
                              value={privateKey}
                              onChange={(e) => setPrivateKey(e.target.value)}
                              placeholder="0x... หรือ ใส่แค่ 64 hex characters"
                              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none font-mono"
                            />
                            <p className="text-xs text-dark-500 mt-1">
                              ⚠️ อย่าแชร์ private key กับใคร
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm text-dark-400 mb-2">
                              ชื่อ Wallet (optional)
                            </label>
                            <input
                              type="text"
                              value={walletName}
                              onChange={(e) => setWalletName(e.target.value)}
                              placeholder="My Imported Wallet"
                              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={handleImportPrivateKey}
                            disabled={loading || !privateKey.trim()}
                            className="w-full py-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                กำลังนำเข้า...
                              </>
                            ) : (
                              <>📥 นำเข้า Wallet</>
                            )}
                          </button>
                        </div>
                      )}

                      {step === 'done' && wallet && (
                        <WalletSuccess
                          wallet={wallet}
                          onReset={resetForm}
                          showPrivateKey={showPrivateKey}
                          setShowPrivateKey={setShowPrivateKey}
                          copyToClipboard={copyToClipboard}
                          copied={copied}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🚀 เริ่มต้นใช้งาน Testnet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-white">สร้าง Wallet</div>
                  <div className="text-sm text-dark-400">
                    สร้างหรือนำเข้า wallet ของคุณ
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-white">
                    รับ Testnet Tokens
                  </div>
                  <div className="text-sm text-dark-400">
                    ไปที่ Faucet เพื่อรับ AXX ฟรี
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-white">เริ่มใช้งาน!</div>
                  <div className="text-sm text-dark-400">
                    ทดลองทำ transactions และสะสมคะแนน
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="mt-6 bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              🌐 Network Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-dark-400">Network Name</div>
                <div className="text-white font-medium">
                  {AXIONAX_TESTNET.chainName}
                </div>
              </div>
              <div>
                <div className="text-dark-400">Chain ID</div>
                <div className="text-white font-medium">
                  {AXIONAX_TESTNET.chainIdDecimal}
                </div>
              </div>
              <div>
                <div className="text-dark-400">Currency</div>
                <div className="text-white font-medium">
                  {AXIONAX_TESTNET.nativeCurrency.symbol}
                </div>
              </div>
              <div>
                <div className="text-dark-400">RPC URL</div>
                <div className="text-white font-medium text-xs truncate">
                  {AXIONAX_TESTNET.rpcUrls[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Success Component
function WalletSuccess({
  wallet,
  onReset,
  showPrivateKey,
  setShowPrivateKey,
  copyToClipboard,
  copied,
}: {
  wallet: GeneratedWallet | ImportedWallet;
  onReset: () => void;
  showPrivateKey: boolean;
  setShowPrivateKey: (show: boolean) => void;
  copyToClipboard: (text: string, label: string) => void;
  copied: string | null;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white">Wallet พร้อมใช้งาน!</h3>
        <p className="text-dark-400 mt-2">Wallet ของคุณถูกบันทึกแล้ว</p>
      </div>

      {/* Address */}
      <div className="bg-dark-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-dark-400">Address</span>
          <button
            onClick={() => copyToClipboard(wallet.address, 'address')}
            className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded text-white"
          >
            {copied === 'address' ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <div className="font-mono text-white break-all text-sm bg-dark-900 rounded p-2">
          {wallet.address}
        </div>
      </div>

      {/* Private Key */}
      <div className="bg-dark-800/50 border border-amber-500/30 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-amber-400">🔐 Private Key</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded text-white"
            >
              {showPrivateKey ? '🙈 Hide' : '👁️ Show'}
            </button>
            {showPrivateKey && (
              <button
                onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded text-white"
              >
                {copied === 'privateKey' ? '✅ Copied!' : '📋 Copy'}
              </button>
            )}
          </div>
        </div>
        <div className="font-mono text-white break-all text-sm bg-dark-900 rounded p-2">
          {showPrivateKey
            ? wallet.privateKey
            : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
        </div>
        <p className="text-xs text-amber-400/70 mt-2">
          ⚠️ อย่าแชร์ private key กับใคร! ผู้ที่มี key นี้สามารถเข้าถึง wallet
          ได้
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors"
        >
          ➕ เพิ่ม Wallet ใหม่
        </button>
        <Link
          href={`/faucet?address=${wallet.address}`}
          className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white text-center font-semibold rounded-xl transition-colors"
        >
          💧 รับ Testnet Tokens
        </Link>
      </div>
    </div>
  );
}
