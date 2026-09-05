import React from 'react';
import { useSelector } from 'react-redux';
import { Layers, Cpu, Wrench, Network } from 'lucide-react';

export default function TechStackPanel() {
  const currentAudit = useSelector((state) => state.monitor.currentAudit);

  if (!currentAudit) return null;

  return (
    <div className="bg-black border border-zinc-800 p-6 rounded-lg mb-8">
      <h2 className="text-base font-mono font-bold text-white mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-red-600" /> Detected Developer Stack & Integrations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* Frontend Tech */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-white" /> FRONTEND FRAMEWORKS
          </p>
          <ul className="space-y-1">
            {currentAudit.frontendTech?.map((item, idx) => (
              <li key={idx} className="text-white font-semibold">• {item}</li>
            ))}
          </ul>
        </div>

        {/* Backend & Server */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <Network className="w-4 h-4 text-white" /> BACKEND / SERVER
          </p>
          <ul className="space-y-1">
            {currentAudit.backendTech?.map((item, idx) => (
              <li key={idx} className="text-red-500 font-semibold">• {item}</li>
            ))}
          </ul>
        </div>

        {/* Third Party Tools */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-white" /> THIRD-PARTY SERVICES
          </p>
          <ul className="space-y-1">
            {currentAudit.thirdPartyServices?.map((item, idx) => (
              <li key={idx} className="text-zinc-300">• {item}</li>
            ))}
          </ul>
        </div>

        {/* APIs & Endpoints */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-2">APIS & ENDPOINTS</p>
          <ul className="space-y-1">
            {currentAudit.apisDetected?.map((item, idx) => (
              <li key={idx} className="text-zinc-400 break-all">• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}