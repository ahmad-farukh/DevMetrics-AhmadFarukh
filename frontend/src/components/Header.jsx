import React from 'react';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-black py-4 px-6 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">DevMetrics</h1>
            <p className="text-2xl text-zinc-400 font-mono">Built by Ahmad Farukh</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded text-xs font-mono text-zinc-300">
          Status: <span className="text-red-500 font-semibold">ENGINE ONLINE</span>
        </div>
      </div>
    </header>
  );
}