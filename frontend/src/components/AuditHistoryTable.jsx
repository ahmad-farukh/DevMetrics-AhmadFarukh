import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchQuery,
  setStatusFilter,
  deleteAuditItem,
  setEditingAuditItem
} from '../features/monitorSlice';
import { Trash2, Edit, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AuditHistoryTable() {
  const dispatch = useDispatch();
  const auditHistory = useSelector((state) => state.monitor.auditHistory);
  const searchQuery = useSelector((state) => state.monitor.searchQuery);
  const statusFilter = useSelector((state) => state.monitor.statusFilter);

  const filteredData = auditHistory.filter((item) => {
    let matchesSearch = false;
    if (item.url.toLowerCase().includes(searchQuery.toLowerCase()) === true) {
      matchesSearch = true;
    }

    let matchesStatus = false;
    if (statusFilter === 'ALL') {
      matchesStatus = true;
    } else if (statusFilter === item.status) {
      matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-black border border-zinc-800 p-6 rounded-lg space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Audit History & Latency Trends</h2>
          <p className="text-xs text-zinc-400 font-mono">Manage and edit tracked endpoints</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search URL..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="bg-black border border-zinc-800 text-white rounded px-3 py-1.5 pl-9 text-xs focus:outline-none focus:border-red-600 font-mono w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="bg-black border border-zinc-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none focus:border-red-600 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">ONLINE</option> <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Latency Recharts Graph */}
      {auditHistory.length > 0 && (
        <div className="h-44 w-full pt-4 border-t border-zinc-900">
          <p className="text-xs font-mono text-zinc-500 mb-2">RESPONSE TIME (MS) OVER AUDITS</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={auditHistory}>
              <XAxis dataKey="url" stroke="#52525b" fontSize={10} />
              <YAxis stroke="#52525b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', color: '#fff' }} />
              <Line type="monotone" dataKey="responseTimeMs" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
              <th className="py-3 px-3">Endpoint URL</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Latency</th>
              <th className="py-3 px-3">Security Score</th>
              <th className="py-3 px-3">Speed Score</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-950 transition-colors">
                <td className="py-3 px-3 text-white font-semibold">{row.url}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'ONLINE' ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-red-950 text-red-500 border border-red-800'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-zinc-300">{row.responseTimeMs} ms</td>
                <td className="py-3 px-3 text-zinc-300">{row.securityScore} / 100</td>
                <td className="py-3 px-3 text-zinc-300">{row.speedScore} / 100</td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
                    onClick={() => dispatch(setEditingAuditItem(row))}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                    title="Edit Record"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(deleteAuditItem(row.id))}
                    className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}