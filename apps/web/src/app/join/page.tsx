'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type NodeType = 'validator' | 'worker' | 'rpc';
type SetupStep = 'choose' | 'requirements' | 'setup' | 'register' | 'verify';

interface RequirementSpec {
  min: string;
  recommended: string;
}

interface NodeRequirements {
  cpu: RequirementSpec;
  ram: RequirementSpec;
  storage: RequirementSpec;
  network: RequirementSpec;
  publicIp: boolean;
  stake: string;
}

const NODE_REQUIREMENTS: Record<NodeType, NodeRequirements> = {
  validator: {
    cpu: { min: '4 cores / 8 threads', recommended: '8+ cores / 16+ threads' },
    ram: { min: '16GB', recommended: '32GB+' },
    storage: { min: '500GB SSD', recommended: '1TB+ NVMe SSD' },
    network: { min: '100 Mbps', recommended: '1 Gbps' },
    publicIp: true,
    stake: '10,000 AXX (Testnet)',
  },
  worker: {
    cpu: { min: '2 cores / 4 threads', recommended: '4+ cores / 8+ threads' },
    ram: { min: '8GB', recommended: '16GB+' },
    storage: { min: '200GB SSD', recommended: '500GB+ SSD' },
    network: { min: '50 Mbps', recommended: '100+ Mbps' },
    publicIp: false,
    stake: '1,000 AXX (Testnet)',
  },
  rpc: {
    cpu: { min: '4 cores / 8 threads', recommended: '8+ cores / 16+ threads' },
    ram: { min: '16GB', recommended: '32GB+' },
    storage: { min: '1TB SSD', recommended: '2TB+ NVMe SSD' },
    network: { min: '500 Mbps', recommended: '1 Gbps' },
    publicIp: true,
    stake: 'Not required',
  },
};

const NODE_DESCRIPTIONS: Record<
  NodeType,
  { title: string; description: string; benefits: string[] }
> = {
  validator: {
    title: 'Validator Node',
    description:
      'Validate and confirm transactions, create new blocks, and secure the network.',
    benefits: [
      'Earn block rewards for creating blocks',
      'Share in transaction fees',
      'Vote in governance',
      'Earn maximum activity score',
    ],
  },
  worker: {
    title: 'Worker Node',
    description: 'Process special computations, indexing and data processing.',
    benefits: [
      'Earn rewards for processing work',
      'Lower hardware requirements than Validator',
      'Good for beginners',
      'Earn moderate activity score',
    ],
  },
  rpc: {
    title: 'RPC Node',
    description: 'Serve API endpoints for dApps and users.',
    benefits: [
      'Earn fees from RPC service',
      'No stake required',
      'For developers and businesses',
      'Monetize your traffic',
    ],
  },
};

export default function JoinNetworkPage() {
  const [step, setStep] = useState<SetupStep>('choose');
  const [nodeType, setNodeType] = useState<NodeType | null>(null);
  const [formData, setFormData] = useState({
    nodeName: '',
    operatorName: '',
    email: '',
    website: '',
    walletAddress: '',
    serverIp: '',
    rpcPort: '8545',
    p2pPort: '30303',
    location: '',
    acceptedTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleNodeSelect = (type: NodeType) => {
    setNodeType(type);
    setStep('requirements');
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async () => {
    // In production, this would call an API
    console.log('Submitting node registration:', { nodeType, ...formData });
    setSubmitted(true);
    setStep('verify');
  };

  const renderChooseStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Node Type</h2>
        <p className="text-dark-400">Select the type of node you want to run</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(
          Object.entries(NODE_DESCRIPTIONS) as [
            NodeType,
            (typeof NODE_DESCRIPTIONS)['validator'],
          ][]
        ).map(([type, info]) => (
          <button
            key={type}
            onClick={() => handleNodeSelect(type)}
            className="text-left p-6 bg-dark-800/50 border border-dark-700 rounded-2xl hover:border-amber-500/50 hover:bg-dark-800 transition-all group"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {info.title}
            </h3>
            <p className="text-dark-400 text-sm mb-4">{info.description}</p>
            <div className="space-y-1">
              {info.benefits.slice(0, 3).map((benefit, i) => (
                <div
                  key={i}
                  className="text-xs text-dark-500 flex items-center gap-1"
                >
                  <span className="text-green-400">✓</span> {benefit}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="text-xs text-dark-500">Minimum Stake</div>
              <div className="text-amber-400 font-semibold">
                {NODE_REQUIREMENTS[type].stake}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderRequirementsStep = () => {
    if (!nodeType) return null;
    const requirements = NODE_REQUIREMENTS[nodeType];
    const info = NODE_DESCRIPTIONS[nodeType];

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep('choose')}
            className="text-dark-400 hover:text-white transition-colors"
          >
            Back
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {info.title}
            </h2>
            <p className="text-dark-400">
              Check requirements before installing
            </p>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-dark-800">
            <h3 className="text-lg font-semibold text-white">
              System Requirements
            </h3>
          </div>
          <div className="divide-y divide-dark-800">
            {[
              { label: 'CPU', ...requirements.cpu },
              { label: 'RAM', ...requirements.ram },
              { label: 'Storage', ...requirements.storage },
              { label: 'Network', ...requirements.network },
            ].map((req) => (
              <div key={req.label} className="flex items-center p-4">
                <div className="flex-1">
                  <div className="text-white font-medium">{req.label}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-dark-500 mb-1">Minimum</div>
                  <div className="text-dark-300">{req.min}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-dark-500 mb-1">Recommended</div>
                  <div className="text-green-400">{req.recommended}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center p-4">
              <div className="w-24 text-2xl">🔓</div>
              <div className="flex-1">
                <div className="text-white font-medium">Public IP</div>
              </div>
              <div className="flex-1 text-center">
                <span
                  className={
                    requirements.publicIp ? 'text-amber-400' : 'text-green-400'
                  }
                >
                  {requirements.publicIp ? 'Required' : 'Not required'}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-dark-400">Static IP preferred</span>
              </div>
            </div>
            <div className="flex items-center p-4 bg-amber-500/5">
              <div className="w-24 text-2xl">💰</div>
              <div className="flex-1">
                <div className="text-white font-medium">Stake Required</div>
              </div>
              <div className="flex-1 text-center" />
              <div className="flex-1 text-center">
                <div className="text-amber-400 font-bold">
                  {requirements.stake}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            ✨ Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {info.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-dark-300">
                <span className="text-green-400">✓</span> {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={() => setStep('setup')}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all"
          >
            Server ready — proceed to next step
          </button>
        </div>
      </div>
    );
  };

  const renderSetupStep = () => {
    if (!nodeType) return null;

    const setupCommands = {
      validator: `# 1. Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential jq

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Clone validator repository
git clone https://github.com/axionaxprotocol/axionax-validator.git
cd axionax-validator

# 4. Run setup script
chmod +x scripts/setup-validator.sh
./scripts/setup-validator.sh

# 5. Generate validator keys
./target/release/axionax-validator keys generate \\
  --output ./keys/validator-key.json

# 6. Start validator
docker-compose up -d`,

      worker: `# 1. Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git docker.io

# 2. Clone worker repository
git clone https://github.com/axionaxprotocol/axionax-worker.git
cd axionax-worker

# 3. Configure worker
cp .env.example .env
nano .env  # Edit WALLET_ADDRESS and RPC_URL

# 4. Start worker
docker-compose up -d`,

      rpc: `# 1. Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git docker.io nginx certbot

# 2. Clone RPC node repository
git clone https://github.com/axionaxprotocol/axionax-rpc-node.git
cd axionax-rpc-node

# 3. Configure node
cp .env.example .env
nano .env  # Edit config as needed

# 4. Start RPC node
docker-compose up -d

# 5. Setup nginx reverse proxy (optional)
sudo cp nginx/axionax-rpc.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/axionax-rpc.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep('requirements')}
            className="text-dark-400 hover:text-white transition-colors"
          >
            Back
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">
              🔧 Setup Instructions
            </h2>
            <p className="text-dark-400">
              ทำตามขั้นตอนเพื่อติดตั้ง {NODE_DESCRIPTIONS[nodeType].title}
            </p>
          </div>
        </div>

        {/* Quick Setup */}
        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-dark-800">
            <h3 className="text-lg font-semibold text-white">
              📜 Setup Commands
            </h3>
            <button
              onClick={() =>
                copyToClipboard(setupCommands[nodeType], 'commands')
              }
              className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-colors"
            >
              {copied === 'commands' ? '✅ Copied!' : '📋 Copy All'}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-green-400">{setupCommands[nodeType]}</code>
          </pre>
        </div>

        {/* Configuration Files */}
        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            ⚙️ Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                Chain ID
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-dark-800 rounded-lg px-4 py-3 font-mono text-white">
                  86137
                </code>
                <button
                  onClick={() => copyToClipboard('86137', 'chainId')}
                  className="px-3 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                >
                  {copied === 'chainId' ? '✅' : '📋'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                Bootnode (P2P)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-dark-800 rounded-lg px-4 py-3 font-mono text-xs text-white overflow-x-auto">
                  enode://abc123...@217.76.61.116:30303
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'enode://abc123...@217.76.61.116:30303',
                      'bootnode'
                    )
                  }
                  className="px-3 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                >
                  {copied === 'bootnode' ? '✅' : '📋'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                RPC Endpoint
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-dark-800 rounded-lg px-4 py-3 font-mono text-white">
                  https://testnet-rpc.axionax.org
                </code>
                <button
                  onClick={() =>
                    copyToClipboard('https://testnet-rpc.axionax.org', 'rpc')
                  }
                  className="px-3 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                >
                  {copied === 'rpc' ? '✅' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">
            ⚠️ Important Notes
          </h3>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Back up private keys and recovery phrase securely
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Ensure required ports are open (8545, 30303)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Use firewall and security best practices
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Monitor node with Prometheus + Grafana (optional)
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={() => setStep('register')}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all"
          >
            Installation complete — register your node
          </button>
        </div>
      </div>
    );
  };

  const renderRegisterStep = () => {
    if (!nodeType) return null;

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep('setup')}
            className="text-dark-400 hover:text-white transition-colors"
          >
            Back
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">Register Node</h2>
            <p className="text-dark-400">Fill in your node details</p>
          </div>
        </div>

        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Node Name *
                </label>
                <input
                  type="text"
                  value={formData.nodeName}
                  onChange={(e) =>
                    setFormData({ ...formData, nodeName: e.target.value })
                  }
                  placeholder="My Validator Node"
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Operator Name *
                </label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) =>
                    setFormData({ ...formData, operatorName: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="operator@example.com"
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-dark-400 mb-2">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, walletAddress: e.target.value })
                  }
                  placeholder="0x..."
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none font-mono"
                />
                <p className="text-xs text-dark-500 mt-1">
                  This address will receive rewards and must have stake{' '}
                  {NODE_REQUIREMENTS[nodeType].stake}
                </p>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Server IP *
                </label>
                <input
                  type="text"
                  value={formData.serverIp}
                  onChange={(e) =>
                    setFormData({ ...formData, serverIp: e.target.value })
                  }
                  placeholder="123.456.789.0"
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Region --</option>
                  <option value="asia-southeast">🇹🇭 Asia Southeast</option>
                  <option value="asia-east">🇯🇵 Asia East</option>
                  <option value="europe-west">🇳🇱 Europe West</option>
                  <option value="europe-east">🇩🇪 Europe East</option>
                  <option value="us-west">🇺🇸 US West</option>
                  <option value="us-east">🇺🇸 US East</option>
                  <option value="australia">🇦🇺 Australia</option>
                  <option value="other">🌍 Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  RPC Port
                </label>
                <input
                  type="text"
                  value={formData.rpcPort}
                  onChange={(e) =>
                    setFormData({ ...formData, rpcPort: e.target.value })
                  }
                  placeholder="8545"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">
                  P2P Port
                </label>
                <input
                  type="text"
                  value={formData.p2pPort}
                  onChange={(e) =>
                    setFormData({ ...formData, p2pPort: e.target.value })
                  }
                  placeholder="30303"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptedTerms}
                onChange={(e) =>
                  setFormData({ ...formData, acceptedTerms: e.target.checked })
                }
                required
                className="mt-1 w-5 h-5 rounded border-dark-600 bg-dark-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-dark-300">
                I accept{' '}
                <Link
                  href="/docs"
                  className="text-amber-400 hover:text-amber-300"
                >
                  Terms of Service
                </Link>{' '}
                and agree to follow network rules and maintain at least 95%
                uptime
              </span>
            </label>

            <button
              type="submit"
              disabled={!formData.acceptedTerms}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 disabled:from-dark-700 disabled:to-dark-700 text-white font-semibold rounded-xl transition-all"
            >
              Register {NODE_DESCRIPTIONS[nodeType].title}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderVerifyStep = () => {
    if (!nodeType) return null;

    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Registration submitted!
          </h2>
          <p className="text-dark-400">
            Your {NODE_DESCRIPTIONS[nodeType].title} is pending verification
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Next steps
          </h3>
          <ol className="space-y-3 text-dark-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm shrink-0">
                1
              </span>
              <div>
                <strong>Check email</strong> — We will send a verification link
                to {formData.email}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm shrink-0">
                2
              </span>
              <div>
                <strong>Stake tokens</strong> — Transfer{' '}
                {NODE_REQUIREMENTS[nodeType].stake} to the Staking Contract
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm shrink-0">
                3
              </span>
              <div>
                <strong>Node verification</strong> — The team will verify your
                node connectivity
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm shrink-0">
                4
              </span>
              <div>
                <strong>Start earning rewards</strong> — Once verified, your
                node will run and earn rewards
              </div>
            </li>
          </ol>
        </div>

        {/* Node Info Summary */}
        <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Node details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-dark-400">Node Name:</span>
              <span className="ml-2 text-white">{formData.nodeName}</span>
            </div>
            <div>
              <span className="text-dark-400">Type:</span>
              <span className="ml-2 text-white">
                {NODE_DESCRIPTIONS[nodeType].title}
              </span>
            </div>
            <div>
              <span className="text-dark-400">Server IP:</span>
              <span className="ml-2 text-white font-mono">
                {formData.serverIp}
              </span>
            </div>
            <div>
              <span className="text-dark-400">Location:</span>
              <span className="ml-2 text-white">
                {formData.location || 'Not specified'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-dark-400">Wallet:</span>
              <span className="ml-2 text-white font-mono text-xs">
                {formData.walletAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/validators"
            className="flex-1 py-4 bg-dark-800 hover:bg-dark-700 text-white text-center font-semibold rounded-xl transition-colors"
          >
            View Validator Leaderboard
          </Link>
          <Link
            href={`/faucet?address=${formData.walletAddress}`}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white text-center font-semibold rounded-xl transition-all"
          >
            Get Testnet Tokens
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <main className="py-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Axionax Network
            </h1>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Join Axionax Testnet as a Validator, Worker or RPC node Node
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {['choose', 'requirements', 'setup', 'register', 'verify'].map(
              (s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step === s
                        ? 'bg-amber-500 text-white'
                        : [
                              'choose',
                              'requirements',
                              'setup',
                              'register',
                              'verify',
                            ].indexOf(step) > i
                          ? 'bg-green-500 text-white'
                          : 'bg-dark-800 text-dark-500'
                    }`}
                  >
                    {[
                      'choose',
                      'requirements',
                      'setup',
                      'register',
                      'verify',
                    ].indexOf(step) > i
                      ? '✓'
                      : i + 1}
                  </div>
                  {i < 4 && (
                    <div
                      className={`w-12 h-0.5 ${
                        [
                          'choose',
                          'requirements',
                          'setup',
                          'register',
                          'verify',
                        ].indexOf(step) > i
                          ? 'bg-green-500'
                          : 'bg-dark-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </div>

          {/* Content */}
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-8">
            {step === 'choose' && renderChooseStep()}
            {step === 'requirements' && renderRequirementsStep()}
            {step === 'setup' && renderSetupStep()}
            {step === 'register' && renderRegisterStep()}
            {step === 'verify' && renderVerifyStep()}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💬</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  Need help?
                </h3>
                <p className="text-dark-300 text-sm mb-3">
                  For questions or installation issues, contact:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://discord.gg/axionax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg text-sm transition-colors"
                  >
                    Discord Community
                  </a>
                  <a
                    href="https://t.me/axionax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg text-sm transition-colors"
                  >
                    Telegram Group
                  </a>
                  <Link
                    href="/docs"
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
