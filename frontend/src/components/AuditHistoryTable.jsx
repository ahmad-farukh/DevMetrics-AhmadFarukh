import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchQuery,
  setStatusFilter,
  deleteAuditItem,
  setEditingAuditItem,
} from '../features/monitorSlice';

const AuditHistoryTable = () => {
  const dispatch = useDispatch();
  const monitorState = useSelector((state) => state.monitor || {});
  const audits = monitorState.audits || [];
  const searchQuery = monitorState.searchQuery || '';
  const statusFilter = monitorState.statusFilter || 'ALL';

  const filteredAudits = audits.filter((item) => {
    if (!item) return false;
    const itemStatus = item?.status ? String(item.status).toUpperCase() : '';
    const itemUrl = item?.url ? String(item.url).toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    const matchesStatus =
      statusFilter === 'ALL' || itemStatus === statusFilter.toUpperCase();
    const matchesSearch = itemUrl.includes(query) || itemStatus.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter audits by URL..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full md:w-1/2 px-4 py-2.5 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          className="w-full md:w-1/4 px-4 py-2.5 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success (200)</option>
          <option value="ERROR">Error / Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="p-4 font-semibold">Target URL</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Response Time</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((item, index) => {
                const statusStr = item?.status ? String(item.status).toUpperCase() : 'UNKNOWN';
                const isSuccess = statusStr === 'SUCCESS' || statusStr === '200';

                return (
                  <tr key={item?.id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-200">{item?.url || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {statusStr}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{item?.responseTime ? `${item.responseTime} ms` : 'N/A'}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => dispatch(setEditingAuditItem(item))}
                          className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => dispatch(deleteAuditItem(item?.id))}
                          className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-500">
                  No audits found. Enter a URL above to test!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditHistoryTable;