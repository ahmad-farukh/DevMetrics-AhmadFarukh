import React from 'react';
import { useSelector } from 'react-redux';

export default function MetricsCards() {
  const currentAudit = useSelector((state) => state.monitor.currentAudit);

  if (currentAudit === null) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Service Status */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <p className="text-xs text-zinc-400 font-mono mb-1">SERVICE STATUS</p>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold font-mono ${currentAudit.status === 'ONLINE' ? 'text-white' : 'text-red-600'}`}>
            {currentAudit.status}
          </span>
          <span className="bg-zinc-900 border border-zinc-800 text-xs px-2.5 py-1 rounded font-mono text-zinc-300">
            HTTP {currentAudit.statusCode}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-3">Latency: <span className="text-white font-mono">{currentAudit.responseTimeMs} ms</span></p>
      </div>

      {/* Security Health Score */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <p className="text-xs text-zinc-400 font-mono mb-1">SECURITY HEALTH SCORE</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold font-mono text-white">
            {currentAudit.securityScore} <span className="text-sm font-normal text-zinc-500">/ 100</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded font-mono ${currentAudit.isHttps ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-red-950 text-red-500 border border-red-800'}`}>
            {currentAudit.isHttps ? 'HTTPS ENCRYPTED' : 'PLAIN HTTP'}
          </span>
        </div>
      </div>

      {/* Speed Performance Score */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <p className="text-xs text-zinc-400 font-mono mb-1">SPEED PERFORMANCE SCORE</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold font-mono text-white">
            {currentAudit.speedScore} <span className="text-sm font-normal text-zinc-500">/ 100</span>
          </span>
          <span className="bg-zinc-900 border border-zinc-800 text-xs px-2 py-1 rounded font-mono text-zinc-300">
            {currentAudit.responseTimeMs < 400 ? 'FAST' : 'SLOW'}
          </span>
        </div>
      </div>
    </div>
  );
}