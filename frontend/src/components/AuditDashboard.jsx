import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runAuditThunk, setSearchQuery, setStatusFilter } from '../features/monitorSlice';
import { ShieldAlert, Zap, Globe, CheckCircle, AlertTriangle, Search, Server } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DesignSystemPanel from './DesignSystemPanel';

export default function AuditDashboard() {
  const [inputUrl, setInputUrl] = useState('');
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.monitor.loading);
  const currentAudit = useSelector((state) => state.monitor.currentAudit);
  const auditHistory = useSelector((state) => state.monitor.auditHistory);
  const searchQuery = useSelector((state) => state.monitor.searchQuery);
  const statusFilter = useSelector((state) => state.monitor.statusFilter);
  const errorMessage = useSelector((state) => state.monitor.errorMessage);

  const handleAuditSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim() !== '') {
      let formattedUrl = inputUrl.trim();
      if (formattedUrl.startsWith('http://') === false && formattedUrl.startsWith('https://') === false) {
        formattedUrl = 'https://' + formattedUrl;
      }
      dispatch(runAuditThunk(formattedUrl));
    }
  };

  // Speed Status Helper
  const getSpeedLabel = (score) => {
    if (score >= 85) return { label: 'FAST', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-700' };
    if (score >= 60) return { label: 'MODERATE', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-700' };
    return { label: 'SLOW', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-700' };
  };

  // Filtering Logic
  const filteredHistory = auditHistory.filter((item) => {
    let matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = statusFilter === 'ALL' || statusFilter === item.status;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-400 flex items-center gap-2">
              <Server className="w-8 h-8" /> DevMetrics Suite
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time Uptime Monitoring, Security Headers Inspector & Speed Optimizer
            </p>
          </div>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleAuditSubmit} className="bg-slate-800 p-4 rounded-xl flex gap-4 border border-slate-700 shadow-lg">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Website URL (e.g., https://mywebsite.com)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Run Audit'}
          </button>
        </form>

        {/* Error Message Display */}
        {errorMessage !== '' && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Audit Report Grid */}
        {currentAudit !== null && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Status & Latency Card */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-slate-400 text-sm font-semibold mb-2">Service Status</h3>
              <div className="flex items-center gap-3">
                {currentAudit.status === 'ONLINE' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                )}
                <div>
                  <span className={`text-2xl font-bold ${currentAudit.status === 'ONLINE' ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {currentAudit.status}
                  </span>
                  <p className="text-xs text-slate-400">HTTP Status: {currentAudit.statusCode}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm">
                <span className="text-slate-400">Response Latency:</span>
                <span className="font-semibold text-slate-200">{currentAudit.responseTimeMs} ms</span>
              </div>
            </div>

            {/* Security Score Card */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-400 text-sm font-semibold">Security Score</h3>
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-4xl font-extrabold text-indigo-400">
                {currentAudit.securityScore} / 100
              </div>
              <p className="text-xs text-slate-400 mt-2">
                HTTPS Enabled: {currentAudit.isHttps ? 'Yes (Encrypted)' : 'No (Insecure)'}
              </p>
            </div>

            {/* Speed Score Card */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-400 text-sm font-semibold">SPEED PERFORMANCE SCORE</h3>
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-4xl font-extrabold text-amber-400">
                {currentAudit.speedScore} / 100
              </div>

              {/* Dynamic Label Fix (Hardcoded SLOW Text Removed) */}
              <div className={`mt-3 inline-block px-3 py-1 rounded text-xs font-bold font-mono tracking-wider ${currentAudit.speedScore >= 85
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700'
                  : currentAudit.speedScore >= 60
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-700'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-700'
                }`}>
                {currentAudit.speedScore >= 85 ? 'FAST' : currentAudit.speedScore >= 60 ? 'MODERATE' : 'SLOW'}
              </div>
            </div>
          </div>
        )}

        {/* Styling, Color Palette, Fonts & Animations Panel */}
        {currentAudit !== null && (
          <DesignSystemPanel audit={currentAudit} />
        )}

        {/* Actionable Recommendations Section */}
        {currentAudit !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Security Recommendations */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Security Vulnerabilities & Fixes
              </h3>
              {currentAudit.securityIssues.length === 0 ? (
                <p className="text-emerald-400 text-sm">All standard security checks passed successfully!</p>
              ) : (
                <ul className="space-y-4">
                  {currentAudit.securityIssues.map((item, idx) => (
                    <li key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                      <p className="text-rose-400 font-semibold text-sm">⚠️ {item.issue}</p>
                      <p className="text-slate-300 text-xs mt-1">💡 <span className="font-semibold">Fix:</span> {item.recommendation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Speed Recommendations */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Speed Optimization Advice
              </h3>
              {currentAudit.speedIssues.length === 0 ? (
                <p className="text-emerald-400 text-sm">Server latency and speed metrics are optimal.</p>
              ) : (
                <ul className="space-y-4">
                  {currentAudit.speedIssues.map((item, idx) => (
                    <li key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                      <p className="text-amber-400 font-semibold text-sm">⚡ {item.issue}</p>
                      <p className="text-slate-300 text-xs mt-1">💡 <span className="font-semibold">Fix:</span> {item.recommendation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* History Analytics Chart & Filter List */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-md-center gap-4">
            <h2 className="text-xl font-bold text-slate-200">Audit History & Latency Trends</h2>

            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search endpoint..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>
          </div>

          {/* Recharts Analytics */}
          {auditHistory.length > 0 && (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={auditHistory}>
                  <XAxis dataKey="url" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="responseTimeMs" stroke="#818cf8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Filtered History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Endpoint URL</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Security Score</th>
                  <th className="py-3 px-4">Speed Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {filteredHistory.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-mono text-indigo-300">{row.url}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === 'ONLINE' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.responseTimeMs} ms</td>
                    <td className="py-3 px-4 font-semibold text-indigo-400">{row.securityScore} / 100</td>
                    <td className="py-3 px-4 font-semibold text-amber-400">{row.speedScore} / 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}