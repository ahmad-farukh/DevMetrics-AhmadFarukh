import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuditItem, setEditingAuditItem } from '../features/monitorSlice';
import { X } from 'lucide-react';

export default function EditModal() {
  const dispatch = useDispatch();
  const editingItem = useSelector((state) => state.monitor.editingAuditItem);

  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('ONLINE');
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    if (editingItem !== null) {
      setUrl(editingItem.url);
      setStatus(editingItem.status);
      setLatency(editingItem.responseTimeMs);
    }
  }, [editingItem]);

  if (editingItem === null) {
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...editingItem,
      url: url,
      status: status,
      responseTimeMs: Number(latency)
    };
    dispatch(updateAuditItem(updated));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-zinc-800 w-full max-w-md p-6 rounded-lg space-y-4">
        
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-mono font-bold text-white">Edit Endpoint Entry</h3>
          <button
            onClick={() => dispatch(setEditingAuditItem(null))}
            className="text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Target URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Override Service Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded focus:outline-none focus:border-red-600"
            >
              <option value="ONLINE">ONLINE</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Simulated Latency (ms)</label>
            <input
              type="number"
              value={latency}
              onChange={(e) => setLatency(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => dispatch(setEditingAuditItem(null))}
              className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded border border-zinc-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}