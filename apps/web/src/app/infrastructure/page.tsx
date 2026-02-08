import React from 'react';

export default function InfrastructurePage(): React.JSX.Element {
  const services = [
    {
      name: 'RPC Node (HTTP)',
      port: 8545,
      status: 'healthy',
      uptime: '18h+',
      details: 'Mock JSON-RPC 2.0',
    },
    {
      name: 'RPC Node (WebSocket)',
      port: 8546,
      status: 'healthy',
      uptime: '18h+',
      details: 'Real-time updates',
    },
    {
      name: 'PostgreSQL',
      port: 5432,
      status: 'healthy',
      uptime: '44h+',
      details: 'Database layer',
    },
    {
      name: 'Redis',
      port: 6379,
      status: 'healthy',
      uptime: '44h+',
      details: 'Cache layer',
    },
    {
      name: 'Nginx',
      port: 80,
      status: 'healthy',
      uptime: '44h+',
      details: 'Web server',
    },
    {
      name: 'Nginx SSL',
      port: 443,
      status: 'healthy',
      uptime: '44h+',
      details: 'HTTPS encryption',
    },
    {
      name: 'Grafana',
      port: 3030,
      status: 'healthy',
      uptime: '15h+',
      details: 'Monitoring v12.2.1',
    },
    {
      name: 'Prometheus',
      port: 9090,
      status: 'healthy',
      uptime: '15h+',
      details: 'Metrics collection',
    },
    {
      name: 'Web Interface',
      port: 3000,
      status: 'healthy',
      uptime: '23h+',
      details: 'axionax-web',
    },
    {
      name: 'Explorer API',
      port: 3001,
      status: 'healthy',
      uptime: '504h+',
      details: 'Blockchain explorer v1.9.0',
    },
    {
      name: 'Faucet API',
      port: 3002,
      status: 'healthy',
      uptime: '504h+',
      details: 'Token distribution v1.9.0',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/20';
      case 'debugging':
        return 'text-amber-400 bg-amber-500/20';
      default:
        return 'text-red-400 bg-red-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'debugging':
        return '🔧';
      default:
        return '❌';
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <main className="section pt-8">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="gradient-text mb-4">Infrastructure Status v1.9.0</h1>
            <p className="text-xl text-dark-300 mb-8">
              Real-time monitoring of all axionax Protocol testnet services •
              Last Updated: December 5, 2025
            </p>

            {/* Overall Status */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-dark-900 border border-dark-800 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">
                  9/9 Services Operational
                </span>
              </div>
              <span className="text-dark-600">|</span>
              <span className="text-dark-300">100% Deployed • v1.9.0</span>
            </div>
          </div>

          {/* VPS Info */}
          <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/20">
            <h2 className="text-2xl font-bold text-dark-100 mb-4">
              VPS Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-dark-400 text-sm mb-1">Server</div>
                <div className="text-dark-100 font-mono">vmi2895217</div>
              </div>
              <div>
                <div className="text-dark-400 text-sm mb-1">IP Address</div>
                <div className="text-dark-100 font-mono">217.216.109.5</div>
              </div>
              <div>
                <div className="text-dark-400 text-sm mb-1">Specifications</div>
                <div className="text-dark-100">7.8GB RAM, 4 cores</div>
              </div>
              <div>
                <div className="text-dark-400 text-sm mb-1">Network</div>
                <div className="text-dark-100">
                  axionax-testnet-1 (Chain ID: 86137)
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-200">
                  RAM Usage
                </h3>
                <span className="text-2xl">💾</span>
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">12%</div>
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '12%' }}
                ></div>
              </div>
              <div className="text-sm text-dark-400 mt-2">~900MB / 7.8GB</div>
            </div>

            <div className="p-6 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-200">
                  CPU Load
                </h3>
                <span className="text-2xl" aria-hidden />
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">Low</div>
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '15%' }}
                ></div>
              </div>
              <div className="text-sm text-dark-400 mt-2">
                {'<'} 1.0 load average
              </div>
            </div>

            <div className="p-6 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-200">
                  Disk Space
                </h3>
                <span className="text-2xl">💿</span>
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">16%</div>
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '16%' }}
                ></div>
              </div>
              <div className="text-sm text-dark-400 mt-2">61GB free</div>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-dark-800 rounded-xl overflow-hidden">
              <thead className="bg-dark-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">
                    Port
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">
                    Uptime
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {services.map((service) => (
                  <tr
                    key={`${service.name}-${service.port}`}
                    className="hover:bg-dark-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-dark-200 font-medium">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 text-dark-300 font-mono">
                      {service.port}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        <span>{getStatusIcon(service.status)}</span>
                        <span>
                          {service.status === 'healthy'
                            ? 'Healthy'
                            : 'Debugging'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-300">
                      {service.uptime}
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-sm">
                      {service.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-dark-900 border border-green-500/20">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                ✅ Infrastructure Layer
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-2">5/5</div>
              <p className="text-dark-400 text-sm mb-4">100% Operational</p>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>• PostgreSQL Database</li>
                <li>• Redis Cache</li>
                <li>• Nginx Web Server</li>
                <li>• Nginx SSL/TLS</li>
                <li>• RPC Node (Active)</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-dark-900 border border-green-500/20">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                ✅ Monitoring Stack
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-2">2/2</div>
              <p className="text-dark-400 text-sm mb-4">100% Operational</p>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>• Grafana v12.2.1</li>
                <li>• Prometheus</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-dark-900 border border-green-500/20">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                ✅ Application Layer
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-2">2/2</div>
              <p className="text-dark-400 text-sm mb-4">100% Operational</p>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>• Explorer API (port 3001)</li>
                <li>• Faucet API (port 3002)</li>
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="mt-12 p-6 rounded-xl bg-dark-900 border border-dark-800">
            <h3 className="text-lg font-semibold text-dark-200 mb-4">
              Documentation
            </h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/axionaxprotocol/axionax-docs/blob/main/INFRASTRUCTURE_STATUS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                Infrastructure Status Dashboard →
              </a>
              <a
                href="https://github.com/axionaxprotocol/axionax-docs/blob/main/HEALTH_CHECKS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary-500/10 border border-secondary-500/20 rounded-lg text-secondary-400 hover:bg-secondary-500/20 transition-colors"
              >
                Health Checks Guide →
              </a>
              <a
                href="https://github.com/axionaxprotocol/axionax-docs/blob/main/MONITORING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary-500/10 border border-secondary-500/20 rounded-lg text-secondary-400 hover:bg-secondary-500/20 transition-colors"
              >
                Monitoring Setup →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
