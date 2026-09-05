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
  const { audits = [], searchQuery = '', statusFilter = 'ALL' } = useSelector(
    (state) => state.monitor || {}
  );

  // Safe Filtering Logic (Prevents Cannot read properties of undefined reading 'status')
  const filteredAudits = (audits || []).filter((item) => {
    if (!item) return false;

    const itemStatus = item?.status ? String(item.status).toUpperCase() : '';
    const itemUrl = item?.url ? String(item.url).toLowerCase() : '';
    const query = (searchQuery || '').toLowerCase();

    const matchesStatus =
      statusFilter === 'ALL' || itemStatus === statusFilter.toUpperCase();

    const matchesSearch = itemUrl.includes(query) || itemStatus.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mt-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by URL or Status..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          className="w-full sm:w-1/4 px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Error</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="p-3">URL</th>
              <th className="p-3">Status</th>
              <th className="p-3">Response Time</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map((item, index) => {
                const status = item?.status || 'UNKNOWN';
                const isSuccess = status.toUpperCase() === 'SUCCESS' || status === '200';

                return (
                  <tr
                    key={item?.id || index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-3 font-mono text-sm dark:text-gray-200">
                      {item?.url || 'N/A'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          isSuccess
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3 text-sm dark:text-gray-300">
                      {item?.responseTime ? `${item.responseTime} ms` : 'N/A'}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => dispatch(setEditingAuditItem(item))}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => dispatch(deleteAuditItem(item?.id))}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No audit logs found.
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