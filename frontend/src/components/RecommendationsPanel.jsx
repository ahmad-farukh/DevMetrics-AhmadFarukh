import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, Zap, Smartphone, Code } from 'lucide-react';

export default function RecommendationsPanel() {
  const currentAudit = useSelector((state) => state.monitor.currentAudit);

  if (currentAudit === null) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Security Fixes */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" /> Security Vulnerabilities
        </h3>
        {currentAudit.securityIssues.length === 0 ? (
          <p className="text-zinc-400 text-xs font-mono">No security header defects detected.</p>
        ) : (
          <div className="space-y-3">
            {currentAudit.securityIssues.map((item, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded">
                <p className="text-xs text-red-500 font-semibold">{item.issue}</p>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Fix: {item.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Speed Optimizations */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-600" /> Speed & Latency Optimizations
        </h3>
        {currentAudit.speedIssues.length === 0 ? (
          <p className="text-zinc-400 text-xs font-mono">Performance latency within optimal range.</p>
        ) : (
          <div className="space-y-3">
            {currentAudit.speedIssues.map((item, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded">
                <p className="text-xs text-white font-semibold">{item.issue}</p>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Fix: {item.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Responsiveness Audit */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-red-600" /> Mobile Responsiveness Checks
        </h3>
        {currentAudit.responsivenessIssues.length === 0 ? (
          <p className="text-zinc-400 text-xs font-mono">Viewport and mobile scale properties configured properly.</p>
        ) : (
          <div className="space-y-3">
            {currentAudit.responsivenessIssues.map((item, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded">
                <p className="text-xs text-red-500 font-semibold">{item.issue}</p>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Fix: {item.fix}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Flaws & Header Exposures */}
      <div className="bg-black border border-zinc-800 p-5 rounded-lg">
        <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-4 h-4 text-red-600" /> Code & Header Flaws
        </h3>
        {currentAudit.codeFlaws.length === 0 ? (
          <p className="text-zinc-400 text-xs font-mono">No sensitive tech headers exposed.</p>
        ) : (
          <div className="space-y-3">
            {currentAudit.codeFlaws.map((item, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded">
                <p className="text-xs text-white font-semibold">{item.flaw}</p>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Fix: {item.fix}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}