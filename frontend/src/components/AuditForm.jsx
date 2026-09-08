import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runAuditThunk } from '../features/monitorSlice';
import { Globe } from 'lucide-react';

export default function AuditForm() {
  const [inputUrl, setInputUrl] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.monitor.loading);
  const errorMessage = useSelector((state) => state.monitor.errorMessage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim() !== '') {
      let formatted = inputUrl.trim();
      if (formatted.startsWith('http://') === false && formatted.startsWith('https://') === false) {
        formatted = 'https://' + formatted;
      }
      dispatch(runAuditThunk(formatted));
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Enter URL to inspect (e.g. https://mywebsite.com)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {loading ? 'AUDITING...' : 'RUN AUDIT'}
        </button>
      </form>

      {errorMessage && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-400 rounded text-xs font-mono">
          {errorMessage}
        </div>
      )}
    </div>
  );
}